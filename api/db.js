// Configuración de base de datos para Vercel (serverless)
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Cache de conexión para evitar múltiples conexiones en serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techconf', opts)
      .then((mongoose) => {
        console.log('✅ Conectado a MongoDB');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ Error conectando a MongoDB:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

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

const Ticket = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);

module.exports = { connectDB, Ticket };
