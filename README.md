# Conferencia Coaching Ontológico - ECOA

Sitio web frontend para la conferencia de Coaching Ontológico organizada por ECOA (Escuela Coaching Ontológico Americano).

## 🎯 Características

- **Página principal** con información completa de la conferencia
- **Página de compra** con formulario de datos del cliente
- **Simulación de compra** completa en modo demo
- **Página de agradecimiento** con código QR generado dinámicamente
- **Verificador de QR** para validar códigos
- **Diseño moderno y responsivo** con colores vibrantes
- **Funciona completamente sin backend** - modo demo integrado

## 📋 Información de la Conferencia

- **Tema:** Coaching Ontológico
- **Organizador:** ECOA (Escuela Coaching Ontológico Americano)
- **Fecha:** 12 de Diciembre de 2025
- **Hora:** 19:00 hs
- **Ubicación:** Salón Auditorio - Hospital Escuela José de San Martín
- **Precio:** $10.000 (Entrada General)
- **Contacto:** 379-4335052

## 🚀 Uso

### Opción 1: Abrir directamente en el navegador

1. Navega a la carpeta del proyecto
2. Haz doble clic en `index.html`
3. El sitio se abrirá en tu navegador

### Opción 2: Servidor local simple

Si tienes Python instalado:
```bash
python -m http.server 8000
```

Luego abre: `http://localhost:8000`

### Opción 3: Live Server (VS Code)

1. Instala la extensión "Live Server"
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"

## 📁 Estructura del Proyecto

```
conferencia-ecoa/
├── index.html              # Página principal
├── comprar.html            # Página de compra de entradas
├── gracias.html            # Página de agradecimiento con QR
├── verificador.html        # Verificador de códigos QR
├── styles.css              # Estilos CSS
├── script.js               # JavaScript del frontend
├── purchase.js             # JavaScript de la página de compra
├── package.json            # Configuración del proyecto
├── .gitignore              # Archivos ignorados por Git
└── README.md               # Este archivo
```

## 🎨 Páginas Disponibles

### 1. **index.html** - Página Principal
- Hero section con información de la conferencia
- Estadísticas (2 Coach Expertas, 1 Día, 19:00 Hora)
- Sección "Acerca de"
- Información de ponentes (Agustina Savino y Valeria Patrono)
- Programa del evento
- Ubicación con mapa de Google Maps
- Precios y botón "Comprar Entradas"

### 2. **comprar.html** - Página de Compra
- Selección de entrada (Entrada General $10.000)
- Formulario de datos del cliente
- Input de cantidad (1-20 entradas)
- Cálculo automático de totales
- Botón "Proceder al Pago" - Simula la compra
- Botón "Simular Compra (Demo)" - Llena automáticamente el formulario

### 3. **gracias.html** - Página de Agradecimiento
- Animación de éxito
- Detalles de la compra
- Información del evento
- **Código QR único generado dinámicamente**
- Información importante para el día del evento
- Datos de contacto

### 4. **verificador.html** - Verificador de QR
- Interfaz para escanear códigos QR
- Estadísticas de escaneos
- Validación de códigos QR (modo demo)
- Interfaz profesional

## 🎯 Flujo de Demostración

1. **Abre `index.html`** - Ver la página principal
2. **Haz clic en "Comprar Entradas"** - Va a `comprar.html`
3. **Haz clic en "Simular Compra (Demo)"** - Llena automáticamente el formulario y simula la compra
4. **Espera 2 segundos** - Se procesa la compra
5. **Verás `gracias.html`** - Con el código QR generado
6. **Opcional: Probar verificador** - Abre `verificador.html` y prueba el QR

## ✨ Características del Modo Demo

- ✅ **Funciona completamente sin backend**
- ✅ **Generación de QR único** para cada compra
- ✅ **Simulación de compra completa**
- ✅ **Datos guardados en localStorage** (temporal)
- ✅ **Validación de formularios**
- ✅ **Cálculo automático de totales**
- ✅ **Diseño responsive** para móvil y desktop

## 🎨 Personalización

### Cambiar información de la conferencia:
- Edita `index.html` para cambiar fechas, ubicación, ponentes, etc.
- Modifica `styles.css` para cambiar colores y diseño

### Cambiar precios:
- Actualiza los precios en `comprar.html`
- Modifica la lógica en `purchase.js`

### Cambiar diseño:
- Modifica `styles.css` para cambiar colores, fuentes, etc.
- Los colores principales están en la paleta de gradientes

## 📱 Diseño Responsive

El sitio está optimizado para:
- 📱 Móviles (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)

## 🎨 Paleta de Colores

El sitio usa una paleta vibrante:
- Rojo: `#ff6b6b`
- Turquesa: `#4ecdc4`
- Azul: `#45b7d1`
- Verde: `#96ceb4`
- Amarillo: `#feca57`

## 📝 Notas

- Este es un proyecto **solo frontend** - no requiere backend
- Todo funciona en **modo demo** sin necesidad de servidor
- Los datos se guardan temporalmente en **localStorage**
- El **QR se genera dinámicamente** en el cliente
- No se envían emails reales ni se procesan pagos reales

## 📞 Información de Contacto

- **Email:** info@ecoa.com
- **Teléfono:** 379-4335052
- **Organizador:** ECOA (Escuela Coaching Ontológico Americano)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

¡Disfruta del sitio! 🎉