# TechConf 2024 - Sistema de Venta de Entradas

Sistema completo de venta de entradas para conferencias con integración a MercadoPago, generación de códigos QR y envío automático de correos electrónicos.

## 🚀 Características

- **Página de información de la conferencia** con diseño moderno y responsivo
- **Formulario de compra** con validación en tiempo real
- **Integración completa con MercadoPago** para procesamiento de pagos
- **Generación automática de códigos QR** para cada entrada
- **Envío automático de correos** con entradas y QR después del pago
- **Webhook para manejo de estados de pago** en tiempo real
- **Base de datos MongoDB** para almacenar información de entradas
- **API REST** para verificación de entradas
- **Diseño responsivo** optimizado para móviles y desktop

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- MongoDB (local o en la nube)
- Cuenta de MercadoPago con credenciales de prueba o producción
- Cuenta de correo electrónico (Gmail recomendado)

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/techconf-entradas.git
   cd techconf-entradas
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Edita el archivo `.env` con tus credenciales:
   ```env
   # MercadoPago
   MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token
   MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/techconf
   
   # Correo electrónico
   SMTP_USER=tu-email@gmail.com
   SMTP_PASS=tu-app-password
   
   # Servidor
   BASE_URL=http://localhost:3000
   PORT=3000
   ```

4. **Configurar MongoDB**
   - Instala MongoDB localmente o usa MongoDB Atlas
   - Asegúrate de que MongoDB esté ejecutándose

5. **Configurar MercadoPago**
   - Crea una cuenta en [MercadoPago](https://www.mercadopago.com.ar/)
   - Obtén tus credenciales de prueba o producción
   - Actualiza el archivo `.env` con tus credenciales

6. **Configurar correo electrónico**
   - Para Gmail: habilita la autenticación de 2 factores
   - Genera una contraseña de aplicación
   - Actualiza `SMTP_USER` y `SMTP_PASS` en el `.env`

## 🚀 Ejecución

### Modo desarrollo
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
techconf-entradas/
├── index.html              # Página principal de la conferencia
├── comprar.html            # Página de compra de entradas
├── styles.css              # Estilos CSS responsivos
├── script.js               # JavaScript del frontend
├── purchase.js             # JavaScript de la página de compra
├── server.js               # Servidor Express.js
├── package.json            # Dependencias del proyecto
├── env.example             # Ejemplo de variables de entorno
└── README.md               # Este archivo
```

## 🔧 Configuración de MercadoPago

1. **Obtener credenciales de prueba:**
   - Ve a [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
   - Crea una aplicación
   - Copia el `Access Token` y `Public Key` de prueba

2. **Configurar webhook:**
   - En el panel de MercadoPago, configura el webhook URL:
   - `https://tu-dominio.com/api/webhook`
   - Para desarrollo local usa ngrok: `https://tu-ngrok-url.ngrok.io/api/webhook`

3. **Actualizar el JavaScript:**
   - En `comprar.html`, actualiza la línea 7:
   ```javascript
   const mp = new MercadoPago('TU_PUBLIC_KEY_AQUI', {
       locale: 'es-AR'
   });
   ```

## 📧 Configuración de Correo Electrónico

### Para Gmail:
1. Habilita la autenticación de 2 factores
2. Ve a "Contraseñas de aplicaciones"
3. Genera una nueva contraseña para "Correo"
4. Usa esta contraseña en `SMTP_PASS`

### Para otros proveedores:
Actualiza la configuración en `server.js`:
```javascript
const transporter = nodemailer.createTransporter({
    host: 'tu-smtp-host',
    port: 587,
    secure: false,
    auth: {
        user: 'tu-email',
        pass: 'tu-password'
    }
});
```

## 🎫 Flujo de Compra

1. **Usuario visita la página principal** (`index.html`)
2. **Hace clic en "Comprar Entradas"** → va a `comprar.html`
3. **Selecciona tipo de entrada** (Early Bird, Regular, VIP)
4. **Completa formulario** con datos personales
5. **Selecciona cantidad** de entradas
6. **Hace clic en "Proceder al Pago"**
7. **MercadoPago procesa el pago**
8. **Webhook recibe confirmación** de pago
9. **Sistema genera código QR** para la entrada
10. **Se envía correo automático** con entrada y QR

## 🔍 API Endpoints

### `POST /api/create-preference`
Crea una preferencia de pago en MercadoPago.

**Body:**
```json
{
  "items": [{
    "title": "Entrada TechConf 2024 - Regular",
    "quantity": 2,
    "unit_price": 399
  }],
  "customer": {
    "name": "Juan Pérez",
    "email": "juan@email.com",
    "phone": "+5491123456789"
  },
  "metadata": {
    "ticketType": "regular",
    "quantity": 2
  }
}
```

### `POST /api/webhook`
Webhook de MercadoPago para notificaciones de pago.

### `GET /api/ticket/:id`
Obtiene información de una entrada por ID.

### `POST /api/verify-qr`
Verifica un código QR de entrada.

**Body:**
```json
{
  "qrData": "{\"ticketId\":\"uuid\",\"customerName\":\"Juan Pérez\"}"
}
```

## 🎨 Personalización

### Cambiar información de la conferencia:
- Edita `index.html` para cambiar fechas, ubicación, ponentes, etc.
- Modifica `styles.css` para cambiar colores y diseño

### Cambiar precios:
- Actualiza los precios en `comprar.html`
- Modifica la lógica en `purchase.js`

### Cambiar diseño del correo:
- Edita la función `sendTicketEmail()` en `server.js`

## 🚀 Despliegue en Producción

1. **Configurar variables de entorno de producción:**
   ```env
   NODE_ENV=production
   MERCADOPAGO_ACCESS_TOKEN=tu-access-token-produccion
   BASE_URL=https://tu-dominio.com
   ```

2. **Usar un servicio de hosting:**
   - Heroku
   - Vercel
   - Railway
   - DigitalOcean

3. **Configurar MongoDB Atlas** para base de datos en la nube

4. **Configurar dominio personalizado** y SSL

## 🔒 Seguridad

- ✅ Validación de datos con express-validator
- ✅ Rate limiting para prevenir ataques
- ✅ Helmet para headers de seguridad
- ✅ Variables de entorno para credenciales
- ✅ Logging de errores y actividades

## 🐛 Solución de Problemas

### Error de conexión a MongoDB:
```bash
# Verificar que MongoDB esté ejecutándose
mongod --version
```

### Error de MercadoPago:
- Verificar credenciales en `.env`
- Comprobar que el webhook esté configurado correctamente

### Error de correo electrónico:
- Verificar credenciales SMTP
- Para Gmail, asegurarse de usar contraseña de aplicación

## 📝 Logs

Los logs se guardan en:
- `combined.log` - Todos los logs
- `error.log` - Solo errores

## 🤝 Contribuciones

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Si tienes problemas o preguntas:
- Abre un issue en GitHub
- Contacta: info@techconf2024.com

---

¡Disfruta tu sistema de venta de entradas! 🎉
