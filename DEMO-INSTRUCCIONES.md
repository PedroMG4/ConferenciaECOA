# 🎫 Demo: Simulación de Compra de Entradas

## 📋 Resumen de la Simulación

Se ha simulado una compra completa de **3 entradas** para la Conferencia de Coaching Ontológico con los siguientes resultados:

### ✅ Estado del Pago: APROBADO
- **Cliente:** Juan Pérez
- **Email:** juan.perez@ejemplo.com
- **Teléfono:** 3791234567
- **Tipo de entrada:** Entrada General
- **Cantidad:** 3 entradas
- **Total pagado:** $30.000
- **ID de compra:** ECO-1760041616992-BLFKNKFY0

### 🎟️ Código QR Único Generado
El sistema generó un código QR único con toda la información de la compra:
- ID de compra único
- Datos del cliente
- Cantidad de entradas
- Información del evento
- Fecha y hora del evento
- Ubicación

### 📧 Email Enviado
Se simuló el envío de un email completo con:
- Confirmación de compra
- Detalles del evento (12 de Diciembre 2025, 19:00 hs)
- Ubicación: Hospital Escuela José de San Martín
- Código QR adjunto para entrada
- Información importante para el día del evento

## 🚀 Cómo Probar la Simulación

### Opción 1: Usar el Botón de Simulación
1. Abre `comprar.html` en tu navegador
2. Haz clic en el botón **"Simular Compra (Demo)"**
3. El sistema llenará automáticamente el formulario
4. Procesará la compra y te redirigirá a `gracias.html`
5. Verás la página de agradecimiento con el QR generado

### Opción 2: Ejecutar Script de Demostración
```bash
node simulate-demo.js
```

### Opción 3: Compra Manual
1. Ve a `comprar.html`
2. Selecciona "Entrada General"
3. Completa el formulario con tus datos
4. Cambia la cantidad a 3 entradas
5. Haz clic en "Proceder al Pago"
6. Se procesará la compra y verás la página de agradecimiento

## 📱 Página de Agradecimiento

La página `gracias.html` incluye:
- ✅ Animación de éxito
- 📋 Detalles completos de la compra
- 🎟️ Código QR generado en tiempo real
- 📅 Información del evento
- 📍 Ubicación con enlace a Google Maps
- ⚠️ Información importante para el día del evento
- 📞 Datos de contacto
- 🖨️ Opción para imprimir la confirmación

## 🔍 Verificación del QR

El código QR contiene toda la información necesaria:
```json
{
  "ticketId": "ECO-1760041616992-BLFKNKFY0",
  "customerName": "Juan Pérez",
  "email": "juan.perez@ejemplo.com",
  "quantity": 3,
  "ticketType": "Entrada General",
  "eventName": "Conferencia Coaching Ontológico",
  "eventDate": "2025-12-12",
  "eventTime": "19:00",
  "venue": "Hospital Escuela José de San Martín",
  "totalAmount": 30000,
  "purchaseDate": "2025-10-09T20:26:56.992Z"
}
```

## 🎯 Características Implementadas

### ✅ Sistema de Compra Completo
- Selección de entradas
- Formulario de datos del cliente
- Validación en tiempo real
- Cálculo automático de totales
- Simulación de pago con MercadoPago

### ✅ Generación de QR Único
- ID único e irrepetible para cada compra
- Información completa del evento
- Datos del cliente y cantidad de entradas
- Fecha y hora de la compra

### ✅ Envío de Email Simulado
- Confirmación de compra
- Código QR adjunto
- Información del evento
- Instrucciones para el día del evento

### ✅ Página de Agradecimiento
- Diseño atractivo y profesional
- Información completa de la compra
- QR generado dinámicamente
- Responsive design

### ✅ Validaciones y Seguridad
- Validación de formularios
- Límites de cantidad (1-20 entradas)
- Datos únicos para cada compra
- Información de contacto

## 🎉 ¡Simulación Exitosa!

El sistema está funcionando perfectamente y simula todo el flujo de compra:
1. **Selección de entradas** ✅
2. **Completar datos del cliente** ✅
3. **Procesamiento del pago** ✅
4. **Generación de QR único** ✅
5. **Envío de email con QR** ✅
6. **Página de confirmación** ✅

¡Todo listo para la conferencia del 12 de Diciembre de 2025! 🎊
