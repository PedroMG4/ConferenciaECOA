const { connectDB, Ticket } = require('./db');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await connectDB();
    
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ error: 'Datos QR requeridos' });
    }

    let parsedData;
    try {
      parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (e) {
      return res.status(400).json({ error: 'Datos QR inválidos' });
    }

    const ticket = await Ticket.findOne({ id: parsedData.ticketId });

    if (!ticket) {
      return res.status(404).json({ 
        valid: false, 
        message: 'Ticket no encontrado' 
      });
    }

    if (ticket.paymentStatus !== 'approved') {
      return res.status(400).json({ 
        valid: false, 
        message: 'Ticket no pagado' 
      });
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
    console.error('❌ Error verificando QR:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
