# 🎨 Cómo Mostrar el Frontend al Cliente

## ✅ El Frontend Funciona Completamente Sin Backend

Todas las páginas están configuradas para funcionar en **modo demo** sin necesidad del backend. Puedes abrir las páginas directamente en el navegador para mostrar el diseño al cliente.

## 🚀 Opciones para Mostrar el Sitio

### Opción 1: Abrir Directamente en el Navegador

1. **Navega a la carpeta del proyecto** en tu explorador de archivos
2. **Haz doble clic** en cualquiera de estos archivos:
   - `index.html` - Página principal
   - `comprar.html` - Página de compra
   - `gracias.html` - Página de agradecimiento
   - `verificador.html` - Verificador de QR

### Opción 2: Usar un Servidor Local Simple

Si tienes Python instalado:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Luego abre en tu navegador: `http://localhost:8000`

Si tienes Node.js:
```bash
npx http-server
```

### Opción 3: Usar Live Server (VS Code)

Si usas VS Code:
1. Instala la extensión "Live Server"
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 📱 Páginas Disponibles

### 1. **index.html** - Página Principal
- Hero section con información de la conferencia
- Estadísticas (2 Coach Expertas, 1 Día, 19:00 Hora)
- Información sobre la conferencia
- Sección de ponentes
- Programa del evento
- Ubicación con mapa de Google
- Botón "Comprar Entradas" que lleva a `comprar.html`

### 2. **comprar.html** - Página de Compra
- Selección de entrada (Entrada General $10.000)
- Formulario de datos del cliente
- Input de cantidad (1-20 entradas)
- Botón "Proceder al Pago" - Simula la compra
- Botón "Simular Compra (Demo)" - Llena automáticamente el formulario y simula la compra

**Para demostrar:**
1. Haz clic en "Simular Compra (Demo)"
2. Espera 2 segundos
3. Serás redirigido a `gracias.html`

### 3. **gracias.html** - Página de Agradecimiento
- Animación de éxito
- Detalles de la compra (3 entradas)
- Información del evento
- **Código QR generado dinámicamente**
- Información importante
- Datos de contacto

**Características:**
- Si vienes de una compra, muestra los datos reales
- Si no hay datos, muestra datos de ejemplo
- **El QR se genera automáticamente** con un ID único

### 4. **verificador.html** - Verificador de QR
- Interfaz para escanear códigos QR
- Muestra estadísticas de escaneos
- Validación de códigos QR
- **Funciona en modo demo** si no hay backend

**Para probar:**
1. Usa el QR generado en `gracias.html`
2. Escanéalo con la cámara o pega el código
3. Verás la validación (en modo demo)

## 🎯 Flujo Completo de Demostración

### Simulación de Compra Completa:

1. **Abre `index.html`**
   - Muestra toda la información de la conferencia
   - Diseño atractivo con colores vibrantes

2. **Haz clic en "Comprar Entradas"**
   - Te lleva a `comprar.html`

3. **En `comprar.html`:**
   - Haz clic en "Simular Compra (Demo)"
   - El formulario se llena automáticamente
   - Espera 2 segundos
   - Serás redirigido a `gracias.html`

4. **En `gracias.html`:**
   - Verás la confirmación de compra
   - **Código QR único generado**
   - Información completa del evento
   - Todo funciona sin backend

5. **Opcional - Verificar QR:**
   - Abre `verificador.html`
   - Usa el QR generado
   - Verás la validación (modo demo)

## ✨ Características del Modo Demo

### ✅ Funciona Completamente:
- ✅ Navegación entre páginas
- ✅ Formularios y validaciones
- ✅ Cálculo de totales
- ✅ Generación de QR único
- ✅ Simulación de compra completa
- ✅ Página de agradecimiento
- ✅ Verificador de QR (modo demo)
- ✅ Diseño responsive
- ✅ Animaciones y efectos

### ⚠️ En Modo Demo:
- No se conecta a MercadoPago real
- No se envían emails reales
- No se guarda en base de datos
- Todo funciona localmente con localStorage

## 🎨 Diseño

El sitio usa:
- **Paleta de colores vibrante**: rojo, turquesa, azul, verde, amarillo
- **Diseño moderno y responsive**
- **Animaciones suaves**
- **Iconos Font Awesome**
- **Tipografía Inter**

## 📋 Checklist para la Demostración

- [ ] Abrir `index.html` - Ver página principal
- [ ] Clic en "Comprar Entradas"
- [ ] Clic en "Simular Compra (Demo)"
- [ ] Ver página de agradecimiento con QR
- [ ] Probar el verificador de QR (opcional)
- [ ] Verificar que todo se vea bien en móvil

## 🚨 Notas Importantes

1. **No necesitas backend** - Todo funciona en modo demo
2. **No necesitas servidor** - Abre los HTML directamente
3. **El QR se genera automáticamente** - Cada vez es único
4. **Los datos se guardan en localStorage** - Solo mientras navegas
5. **Diseño responsive** - Funciona en móvil y desktop

## 🎉 ¡Listo para Mostrar!

El frontend está completamente funcional y listo para mostrar al cliente. Puedes abrir cualquier página HTML directamente en el navegador y todo funcionará perfectamente en modo demo.
