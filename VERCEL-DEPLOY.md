# 🚀 Guía de Despliegue en Vercel

## 📋 Estructura del Proyecto para Vercel

El proyecto está configurado para funcionar como funciones serverless en Vercel:

```
proyecto/
├── api/                    # Funciones serverless
│   ├── db.js              # Conexión a MongoDB (compartida)
│   ├── create-preference.js  # Crear preferencia de pago
│   ├── webhook.js         # Webhook de MercadoPago
│   ├── verify-qr.js       # Verificar código QR
│   └── ticket/
│       └── [id].js        # Obtener ticket por ID
├── vercel.json            # Configuración de Vercel
├── index.html             # Página principal
├── comprar.html           # Página de compra
├── gracias.html           # Página de agradecimiento
├── verificador.html       # Página de verificación
├── styles.css             # Estilos
├── script.js              # Scripts del frontend
├── purchase.js            # Scripts de compra
└── package.json           # Dependencias
```

## 🔧 Variables de Entorno Requeridas

Configura estas variables en el panel de Vercel (Settings > Environment Variables):

### MercadoPago
```
MERCADOPAGO_ACCESS_TOKEN=tu-access-token-de-mercadopago
```

### MongoDB
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Email (Nodemailer)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
```

### Base URL (Opcional)
```
BASE_URL=https://tu-dominio.vercel.app
```

## 📝 Pasos para Desplegar

### 1. Instalar Vercel CLI (si no lo tienes)
```bash
npm i -g vercel
```

### 2. Iniciar sesión en Vercel
```bash
vercel login
```

### 3. Desplegar
```bash
# Despliegue de producción
vercel --prod

# O despliegue de preview
vercel
```

### 4. Configurar Variables de Entorno
1. Ve al dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a Settings > Environment Variables
4. Agrega todas las variables de entorno requeridas
5. Vuelve a desplegar si es necesario

## 🔍 Verificar el Despliegue

### URLs de las Funciones API:
- `https://tu-proyecto.vercel.app/api/create-preference`
- `https://tu-proyecto.vercel.app/api/webhook`
- `https://tu-proyecto.vercel.app/api/verify-qr`
- `https://tu-proyecto.vercel.app/api/ticket/[id]`

### URLs de las Páginas:
- `https://tu-proyecto.vercel.app/` - Página principal
- `https://tu-proyecto.vercel.app/comprar` - Página de compra
- `https://tu-proyecto.vercel.app/gracias` - Página de agradecimiento
- `https://tu-proyecto.vercel.app/verificador` - Verificador de QR

## 🐛 Solución de Problemas

### Error: FUNCTION_INVOCATION_FAILED
1. **Verifica las variables de entorno** - Asegúrate de que todas estén configuradas
2. **Revisa los logs** - Ve a Vercel Dashboard > Deployments > Function Logs
3. **Verifica la conexión a MongoDB** - Asegúrate de que la URI sea correcta
4. **Verifica las credenciales de MercadoPago** - El token debe ser válido

### Error: MongoDB Connection
- Verifica que la URI de MongoDB sea correcta
- Asegúrate de que la IP esté permitida en MongoDB Atlas (o usa 0.0.0.0/0 para desarrollo)
- Verifica que el usuario tenga permisos de lectura/escritura

### Error: Email no se envía
- Verifica las credenciales de SMTP
- Para Gmail, usa una "App Password" no tu contraseña normal
- Verifica que el puerto 587 esté habilitado

### Error: MercadoPago Webhook
- Configura el webhook en MercadoPago Dashboard apuntando a: `https://tu-proyecto.vercel.app/api/webhook`
- Verifica que el token de acceso sea correcto

## 📊 Monitoreo

### Logs en Vercel
- Ve a tu proyecto en Vercel Dashboard
- Haz clic en "Functions" o "Deployments"
- Selecciona un deployment para ver los logs

### Logs en tiempo real
```bash
vercel logs tu-proyecto
```

## 🔄 Actualizar el Despliegue

Cada vez que hagas cambios y los subas a Git, Vercel automáticamente:
1. Detectará los cambios
2. Creará un nuevo deployment
3. Ejecutará los tests (si los tienes)
4. Desplegará en producción

O puedes forzar un nuevo deployment:
```bash
vercel --prod
```

## ✅ Checklist Pre-Deploy

- [ ] Variables de entorno configuradas en Vercel
- [ ] MongoDB URI correcta y accesible
- [ ] Credenciales de MercadoPago configuradas
- [ ] Credenciales de email configuradas
- [ ] Webhook de MercadoPago configurado
- [ ] Pruebas locales funcionando
- [ ] Base URL configurada correctamente

## 🎯 Notas Importantes

1. **Conexión a MongoDB**: Se usa un sistema de cache para evitar múltiples conexiones en el entorno serverless
2. **Timeout**: Las funciones tienen un máximo de 30 segundos (configurado en vercel.json)
3. **Cold Start**: La primera invocación puede tardar más debido al "cold start"
4. **Variables de Entorno**: Se recomienda usar Vercel Secrets para datos sensibles

## 📚 Recursos

- [Documentación de Vercel](https://vercel.com/docs)
- [Funciones Serverless de Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [MercadoPago Developers](https://www.mercadopago.com.ar/developers)
