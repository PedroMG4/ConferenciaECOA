// Simulador de envío de email con QR
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Configuración del transporter (simulado)
const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER || 'demo@ecoa.com',
        pass: process.env.EMAIL_PASS || 'demo-password'
    }
});

// Función para simular envío de email
async function simulateEmailWithQR(purchaseData) {
    try {
        console.log('🎫 Iniciando simulación de envío de email...');
        
        // Generar QR único
        const qrData = {
            ticketId: purchaseData.paymentId,
            customerName: `${purchaseData.firstName} ${purchaseData.lastName}`,
            email: purchaseData.email,
            quantity: purchaseData.quantity,
            ticketType: purchaseData.ticketType,
            eventName: 'Conferencia Coaching Ontológico',
            eventDate: '2025-12-12',
            eventTime: '19:00',
            venue: 'Hospital Escuela José de San Martín',
            totalAmount: purchaseData.total,
            purchaseDate: purchaseData.purchaseDate
        };

        // Generar QR como buffer
        const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        console.log('✅ QR generado exitosamente');

        // Configurar email
        const mailOptions = {
            from: 'info@ecoa.com',
            to: purchaseData.email,
            subject: `🎫 Tu entrada para Conferencia Coaching Ontológico - ${purchaseData.ticketType}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
                    <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #1f2937; margin-bottom: 10px;">🎫 Conferencia Coaching Ontológico</h1>
                            <p style="color: #6b7280; font-size: 18px;">¡Tu compra ha sido confirmada!</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #ff6b6b, #feca57); border-radius: 15px; padding: 20px; margin-bottom: 30px; text-align: center;">
                            <h2 style="color: white; margin: 0; font-size: 24px;">✅ Pago Aprobado</h2>
                        </div>
                        
                        <div style="background: #f0f9ff; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                            <h3 style="color: #1f2937; margin-bottom: 15px;">📋 Detalles de tu Compra</h3>
                            <p><strong>Cliente:</strong> ${purchaseData.firstName} ${purchaseData.lastName}</p>
                            <p><strong>Email:</strong> ${purchaseData.email}</p>
                            <p><strong>Teléfono:</strong> ${purchaseData.phone}</p>
                            <p><strong>Tipo de entrada:</strong> ${purchaseData.ticketType}</p>
                            <p><strong>Cantidad:</strong> ${purchaseData.quantity} entradas</p>
                            <p><strong>Total pagado:</strong> $${purchaseData.total.toLocaleString()}</p>
                            <p><strong>ID de compra:</strong> ${purchaseData.paymentId}</p>
                        </div>
                        
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h3 style="color: #1f2937; margin-bottom: 15px;">🎟️ Tu Código QR</h3>
                            <p style="color: #6b7280; margin-bottom: 20px;">Presenta este código en la entrada del evento</p>
                            <div style="background: white; padding: 20px; border-radius: 15px; display: inline-block; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                                <img src="cid:qrcode" alt="Código QR" style="width: 200px; height: 200px;">
                            </div>
                        </div>
                        
                        <div style="background: #fff5f5; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                            <h3 style="color: #1f2937; margin-bottom: 15px;">📅 Información del Evento</h3>
                            <p><strong>Fecha del evento:</strong> 12 de Diciembre 2025</p>
                            <p><strong>Hora:</strong> 19:00 hs</p>
                            <p><strong>Ubicación:</strong> Salón Auditorio - Hospital Escuela José de San Martín</p>
                            <p><strong>Dirección:</strong> <a href="https://www.google.com/maps/place/Hospital+Escuela+%22Jos%C3%A9+de+San+Mart%C3%ADn%22" style="color: #ff6b6b;">Ver en Google Maps</a></p>
                        </div>
                        
                        <div style="background: #f0f9ff; border-radius: 10px; padding: 20px; margin-bottom: 30px;">
                            <h3 style="color: #1f2937; margin-bottom: 15px;">⚠️ Información Importante</h3>
                            <ul style="color: #6b7280; line-height: 1.6;">
                                <li>Llega 30 minutos antes del inicio (18:30 hs)</li>
                                <li>Trae una identificación oficial</li>
                                <li>Presenta el código QR o este correo electrónico</li>
                                <li>No hay estacionamiento gratuito disponible</li>
                            </ul>
                        </div>
                        
                        <div style="text-align: center; padding: 20px; background: #f8fafc; border-radius: 10px;">
                            <p style="color: #6b7280; margin-bottom: 10px;">Si tienes alguna pregunta, contáctanos:</p>
                            <p style="color: #374151; font-weight: 600;">📧 info@ecoa.com | 📞 379-4335052</p>
                            <p style="color: #9ca3af; font-size: 14px; margin-top: 15px;">© 2025 ECOA. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            `,
            attachments: [{
                filename: 'qrcode.png',
                content: qrBuffer,
                cid: 'qrcode'
            }]
        };

        console.log('📧 Simulando envío de email...');
        console.log('📬 Destinatario:', purchaseData.email);
        console.log('🎟️ QR adjunto con ID:', purchaseData.paymentId);
        
        // En un entorno real, aquí se enviaría el email:
        // const info = await transporter.sendMail(mailOptions);
        // console.log('✅ Email enviado:', info.messageId);
        
        // Simulación exitosa
        console.log('✅ Simulación de email completada exitosamente');
        console.log('📋 Datos del QR:', qrData);
        
        return {
            success: true,
            qrData: qrData,
            emailData: mailOptions
        };
        
    } catch (error) {
        console.error('❌ Error en simulación de email:', error);
        throw error;
    }
}

// Exportar función
module.exports = { simulateEmailWithQR };

// Ejemplo de uso
if (require.main === module) {
    const examplePurchaseData = {
        paymentId: 'ECO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@ejemplo.com',
        phone: '3791234567',
        quantity: 3,
        ticketType: 'Entrada General',
        total: 30000,
        purchaseDate: new Date().toISOString()
    };
    
    simulateEmailWithQR(examplePurchaseData)
        .then(result => {
            console.log('🎉 Simulación completada:', result);
        })
        .catch(error => {
            console.error('💥 Error en simulación:', error);
        });
}
