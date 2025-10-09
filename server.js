const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const { MercadoPago } = require('mercadopago');
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const winston = require('winston');

// Configurar logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar MercadoPago
const client = new MercadoPago({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    options: {
        sandbox: process.env.NODE_ENV !== 'production'
    }
});

// Configurar Nodemailer
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Esquema de MongoDB para entradas
const ticketSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    ticketType: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentId: { type: String, required: true },
    paymentStatus: { type: String, default: 'pending' },
    qrCode: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // máximo 100 requests por ventana
    message: 'Demasiadas solicitudes, intenta más tarde'
});
app.use('/api/', limiter);

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techconf', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Conectado a MongoDB');
}).catch(err => {
    logger.error('Error conectando a MongoDB:', err);
});

// Rutas

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Ruta de compra
app.get('/comprar', (req, res) => {
    res.sendFile(__dirname + '/comprar.html');
});

// API: Crear preferencia de pago
app.post('/api/create-preference', [
    body('items').isArray({ min: 1 }),
    body('customer.name').notEmpty(),
    body('customer.email').isEmail(),
    body('customer.phone').notEmpty(),
    body('metadata').isObject()
], async (req, res) => {
    try {
        // Validar datos
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { items, customer, metadata } = req.body;

        // Crear preferencia en MercadoPago
        const preference = {
            items: items.map(item => ({
                title: item.title,
                quantity: parseInt(item.quantity),
                unit_price: parseFloat(item.unit_price)
            })),
            payer: {
                name: customer.name,
                email: customer.email,
                phone: {
                    number: customer.phone
                }
            },
            back_urls: {
                success: `${process.env.BASE_URL || 'http://localhost:3000'}/comprar?status=approved`,
                failure: `${process.env.BASE_URL || 'http://localhost:3000'}/comprar?status=rejected`,
                pending: `${process.env.BASE_URL || 'http://localhost:3000'}/comprar?status=pending`
            },
            auto_return: 'approved',
            notification_url: `${process.env.BASE_URL || 'http://localhost:3000'}/api/webhook`,
            metadata: metadata
        };

        const result = await client.preferences.create(preference);
        
        logger.info('Preferencia creada:', result.id);
        res.json({ id: result.id });

    } catch (error) {
        logger.error('Error creando preferencia:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Webhook de MercadoPago
app.post('/api/webhook', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const paymentId = data.id;
            
            // Obtener información del pago
            const payment = await client.payments.get(paymentId);
            
            if (payment.status === 'approved') {
                await processApprovedPayment(payment);
            } else if (payment.status === 'pending') {
                await processPendingPayment(payment);
            } else if (payment.status === 'rejected') {
                await processRejectedPayment(payment);
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        logger.error('Error en webhook:', error);
        res.status(500).send('Error');
    }
});

// Función para procesar pago aprobado
async function processApprovedPayment(payment) {
    try {
        const metadata = payment.metadata;
        
        // Crear entrada en la base de datos
        const ticket = new Ticket({
            customerName: `${payment.payer.first_name} ${payment.payer.last_name}`,
            customerEmail: payment.payer.email,
            customerPhone: payment.payer.phone?.number || '',
            ticketType: metadata.ticketType,
            quantity: parseInt(metadata.quantity),
            unitPrice: parseFloat(payment.transaction_amount) / parseInt(metadata.quantity),
            totalAmount: parseFloat(payment.transaction_amount),
            paymentId: payment.id.toString(),
            paymentStatus: 'approved'
        });

        await ticket.save();
        logger.info('Ticket creado:', ticket.id);

        // Generar código QR
        const qrData = {
            ticketId: ticket.id,
            customerName: ticket.customerName,
            ticketType: ticket.ticketType,
            quantity: ticket.quantity,
            eventName: 'Conferencia Coaching Ontológico',
            eventDate: '12 de Diciembre 2025',
            eventTime: '19:00 hs',
            venue: 'Hospital Escuela José de San Martín'
        };

        const qrCodeBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
            type: 'png',
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        ticket.qrCode = qrCodeBuffer.toString('base64');
        await ticket.save();

        // Enviar correo con QR
        await sendTicketEmail(ticket, qrCodeBuffer);

        logger.info('Pago procesado exitosamente:', payment.id);

    } catch (error) {
        logger.error('Error procesando pago aprobado:', error);
    }
}

// Función para procesar pago pendiente
async function processPendingPayment(payment) {
    try {
        const metadata = payment.metadata;
        
        const ticket = new Ticket({
            customerName: `${payment.payer.first_name} ${payment.payer.last_name}`,
            customerEmail: payment.payer.email,
            customerPhone: payment.payer.phone?.number || '',
            ticketType: metadata.ticketType,
            quantity: parseInt(metadata.quantity),
            unitPrice: parseFloat(payment.transaction_amount) / parseInt(metadata.quantity),
            totalAmount: parseFloat(payment.transaction_amount),
            paymentId: payment.id.toString(),
            paymentStatus: 'pending'
        });

        await ticket.save();
        logger.info('Ticket pendiente creado:', ticket.id);

    } catch (error) {
        logger.error('Error procesando pago pendiente:', error);
    }
}

// Función para procesar pago rechazado
async function processRejectedPayment(payment) {
    try {
        logger.info('Pago rechazado:', payment.id);
        // Aquí se podría enviar un correo al cliente informando sobre el rechazo
        
    } catch (error) {
        logger.error('Error procesando pago rechazado:', error);
    }
}

// Función para enviar correo con entrada
async function sendTicketEmail(ticket, qrCodeBuffer) {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: ticket.customerEmail,
            subject: `🎫 Tu entrada para Conferencia Coaching Ontológico - ${ticket.ticketType}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                        .ticket-info { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                        .qr-code { text-align: center; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
                        .highlight { background: #667eea; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎫 Conferencia Coaching Ontológico</h1>
                            <p>Tu entrada ha sido confirmada</p>
                        </div>
                        <div class="content">
                            <h2>¡Hola ${ticket.customerName}!</h2>
                            <p>Tu compra ha sido procesada exitosamente. Aquí tienes los detalles de tu entrada:</p>
                            
                            <div class="ticket-info">
                                <h3>Detalles de la Entrada</h3>
                                <p><strong>Tipo:</strong> <span class="highlight">${ticket.ticketType}</span></p>
                                <p><strong>Cantidad:</strong> ${ticket.quantity} entrada(s)</p>
                                <p><strong>Precio unitario:</strong> $${ticket.unitPrice}</p>
                                <p><strong>Total pagado:</strong> $${ticket.totalAmount}</p>
                                <p><strong>ID de entrada:</strong> ${ticket.id}</p>
                                <p><strong>Fecha del evento:</strong> 12 de Diciembre 2025</p>
                                <p><strong>Hora:</strong> 19:00 hs</p>
                                <p><strong>Ubicación:</strong> Salón Auditorio - Hospital Escuela José de San Martín</p>
                            </div>
                            
                            <div class="qr-code">
                                <h3>Código QR de tu entrada</h3>
                                <img src="data:image/png;base64,${ticket.qrCode}" alt="Código QR" style="max-width: 300px; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                                <p><small>Presenta este código QR en la entrada del evento</small></p>
                            </div>
                            
                            <div class="ticket-info">
                                <h3>Instrucciones importantes</h3>
                                <ul>
                                    <li>Llega al menos 30 minutos antes del inicio del evento</li>
                                    <li>Presenta este correo o el código QR en la entrada</li>
                                    <li>Trae una identificación oficial</li>
                                    <li>El código QR es válido para todas las entradas compradas</li>
                                </ul>
                            </div>
                            
                            <div class="footer">
                                <p>Si tienes alguna pregunta, contáctanos en info@ecoa.com o al 379-4335052</p>
                                <p>© 2025 ECOA. Todos los derechos reservados.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            attachments: [
                {
                    filename: 'entrada-techconf-qr.png',
                    content: qrCodeBuffer,
                    cid: 'qrcode'
                }
            ]
        };

        await transporter.sendMail(mailOptions);
        logger.info('Correo enviado exitosamente a:', ticket.customerEmail);

    } catch (error) {
        logger.error('Error enviando correo:', error);
    }
}

// API: Obtener estado de ticket
app.get('/api/ticket/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findOne({ id: req.params.id });
        
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket no encontrado' });
        }

        res.json({
            id: ticket.id,
            customerName: ticket.customerName,
            ticketType: ticket.ticketType,
            quantity: ticket.quantity,
            paymentStatus: ticket.paymentStatus,
            createdAt: ticket.createdAt
        });

    } catch (error) {
        logger.error('Error obteniendo ticket:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// API: Verificar QR
app.post('/api/verify-qr', [
    body('qrData').notEmpty()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const qrData = JSON.parse(req.body.qrData);
        const ticket = await Ticket.findOne({ id: qrData.ticketId });

        if (!ticket) {
            return res.status(404).json({ valid: false, message: 'Ticket no encontrado' });
        }

        if (ticket.paymentStatus !== 'approved') {
            return res.status(400).json({ valid: false, message: 'Ticket no pagado' });
        }

        res.json({
            valid: true,
            ticket: {
                customerName: ticket.customerName,
                ticketType: ticket.ticketType,
                quantity: ticket.quantity,
                eventName: 'Conferencia Coaching Ontológico'
            }
        });

    } catch (error) {
        logger.error('Error verificando QR:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    logger.error('Error no manejado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    logger.info(`Servidor ejecutándose en puerto ${PORT}`);
    logger.info(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});
