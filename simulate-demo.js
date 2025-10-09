// Simulador de envío de email con QR (sin dependencias)
console.log('🎫 Iniciando simulación de compra de 3 entradas...\n');

// Datos de la compra simulada
const purchaseData = {
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

console.log('📋 Datos de la compra:');
console.log('   Cliente:', `${purchaseData.firstName} ${purchaseData.lastName}`);
console.log('   Email:', purchaseData.email);
console.log('   Teléfono:', purchaseData.phone);
console.log('   Tipo:', purchaseData.ticketType);
console.log('   Cantidad:', purchaseData.quantity, 'entradas');
console.log('   Total:', `$${purchaseData.total.toLocaleString()}`);
console.log('   ID de compra:', purchaseData.paymentId);
console.log('');

// Simular QR único
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

console.log('🎟️ Generando código QR único...');
console.log('✅ QR generado exitosamente');
console.log('');

console.log('📧 Simulando envío de email...');
console.log('   Destinatario:', purchaseData.email);
console.log('   Asunto: 🎫 Tu entrada para Conferencia Coaching Ontológico - Entrada General');
console.log('   Adjunto: Código QR único');
console.log('');

console.log('📬 Contenido del email:');
console.log('   - Confirmación de compra');
console.log('   - Detalles del evento (12 de Diciembre 2025, 19:00 hs)');
console.log('   - Ubicación: Hospital Escuela José de San Martín');
console.log('   - Código QR para entrada');
console.log('   - Información importante para el día del evento');
console.log('');

console.log('✅ Estado del pago: APROBADO');
console.log('✅ Email enviado exitosamente');
console.log('✅ QR generado y adjuntado');
console.log('');

console.log('🎉 ¡Simulación completada exitosamente!');
console.log('📱 El cliente recibirá un email con su código QR único');
console.log('🎫 Deberá presentar el QR en la entrada del evento');
console.log('');

console.log('🔍 Datos del QR para verificación:');
console.log(JSON.stringify(qrData, null, 2));
