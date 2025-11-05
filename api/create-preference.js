const { MercadoPago } = require('mercadopago');

// Configurar MercadoPago
const client = new MercadoPago({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  options: {
    sandbox: process.env.NODE_ENV !== 'production'
  }
});

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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
    const { items, customer, metadata } = req.body;

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items requeridos' });
    }

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({ error: 'Datos del cliente requeridos' });
    }

    const baseUrl = process.env.BASE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

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
        success: `${baseUrl}/comprar?status=approved`,
        failure: `${baseUrl}/comprar?status=rejected`,
        pending: `${baseUrl}/comprar?status=pending`
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhook`,
      metadata: metadata || {}
    };

    const result = await client.preferences.create(preference);
    
    console.log('✅ Preferencia creada:', result.id);
    res.status(200).json({ id: result.id });

  } catch (error) {
    console.error('❌ Error creando preferencia:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: error.message 
    });
  }
};
