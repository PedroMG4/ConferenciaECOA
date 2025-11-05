const { MercadoPago } = require('mercadopago');
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const { connectDB, Ticket } = require('./db');

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

async function sendTicketEmail(ticket, qrCodeBuffer) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || 'info@ecoa.com',
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
            .header { background: linear-gradient(135deg, #ff6b6b, #feca57); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
            .ticket-info { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .qr-code { text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
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
                <p><strong>Tipo:</strong> ${ticket.ticketType}</p>
                <p><strong>Cantidad:</strong> ${ticket.quantity} entrada(s)</p>
                <p><strong>Total pagado:</strong> $${ticket.totalAmount.toLocaleString()}</p>
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
          filename: 'entrada-qr.png',
          content: qrCodeBuffer,
          cid: 'qrcode'
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado exitosamente a:', ticket.customerEmail);

  } catch (error) {
    console.error('❌ Error enviando correo:', error);
  }
}

async function processApprovedPayment(payment) {
  try {
    await connectDB();
    
    const metadata = payment.metadata || {};
    
    // Crear entrada en la base de datos
    const ticket = new Ticket({
      customerName: `${payment.payer.first_name || ''} ${payment.payer.last_name || ''}`.trim() || payment.payer.email,
      customerEmail: payment.payer.email,
      customerPhone: payment.payer.phone?.number || '',
      ticketType: metadata.ticketType || 'Entrada General',
      quantity: parseInt(metadata.quantity || 1),
      unitPrice: parseFloat(payment.transaction_amount) / parseInt(metadata.quantity || 1),
      totalAmount: parseFloat(payment.transaction_amount),
      paymentId: payment.id.toString(),
      paymentStatus: 'approved'
    });

    await ticket.save();
    console.log('✅ Ticket creado:', ticket.id);

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

    console.log('✅ Pago procesado exitosamente:', payment.id);

  } catch (error) {
    console.error('❌ Error procesando pago aprobado:', error);
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener información del pago
      const payment = await client.payments.get({ id: paymentId });
      
      if (payment.status === 'approved') {
        await processApprovedPayment(payment);
      } else if (payment.status === 'pending') {
        console.log('⏳ Pago pendiente:', paymentId);
        // Aquí puedes procesar pagos pendientes si es necesario
      } else if (payment.status === 'rejected') {
        console.log('❌ Pago rechazado:', paymentId);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en webhook:', error);
    res.status(500).send('Error');
  }
};
