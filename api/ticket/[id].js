const { connectDB, Ticket } = require('../db');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    await connectDB();
    
    const { id } = req.query;
    const ticket = await Ticket.findOne({ id });

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
    console.error('❌ Error obteniendo ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
