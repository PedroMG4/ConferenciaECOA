// Variables globales
let selectedTicket = null;
let selectedPrice = 0;
let selectedQuantity = 1;
let customerData = {};

// Inicializar MercadoPago (solo si está disponible)
let mp = null;
try {
    if (typeof MercadoPago !== 'undefined') {
        mp = new MercadoPago('TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', {
            locale: 'es-AR'
        });
    }
} catch (error) {
    console.log('MercadoPago SDK no disponible, usando modo demo');
}

// Función para seleccionar ticket
function selectTicket(type, price) {
    selectedTicket = type;
    selectedPrice = price;
    
    // Remover selección anterior
    document.querySelectorAll('.ticket-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Agregar selección actual
    event.target.closest('.ticket-option').classList.add('selected');
    
    // Mostrar formulario
    document.getElementById('customerForm').style.display = 'block';
    
    // Actualizar información del ticket
    updateTicketInfo();
    
    // Scroll suave al formulario
    document.getElementById('customerForm').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Función para actualizar información del ticket
function updateTicketInfo() {
    const ticketNames = {
        'general': 'Entrada General'
    };
    
    document.getElementById('selectedTicketType').textContent = ticketNames[selectedTicket];
    document.getElementById('selectedQuantity').textContent = selectedQuantity;
    calculateTotal();
}

// Función para calcular total
function calculateTotal() {
    const quantityInput = document.getElementById('quantity');
    selectedQuantity = parseInt(quantityInput.value) || 1;
    
    // Validar que la cantidad esté dentro del rango permitido
    if (selectedQuantity < 1) {
        selectedQuantity = 1;
        quantityInput.value = 1;
    } else if (selectedQuantity > 20) {
        selectedQuantity = 20;
        quantityInput.value = 20;
    }
    
    const total = selectedPrice * selectedQuantity;
    document.getElementById('totalAmount').textContent = `$${total.toLocaleString()}`;
    
    // Actualizar información si ya se seleccionó una cantidad
    if (selectedTicket) {
        updateTicketInfo();
    }
}

// Función para procesar pago
async function processPayment() {
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Recopilar datos del cliente
    customerData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        quantity: selectedQuantity,
        ticketType: selectedTicket,
        price: selectedPrice,
        total: selectedPrice * selectedQuantity
    };
    
    // Mostrar loading
    const payButton = document.getElementById('payButton');
    if (payButton) {
        const originalText = payButton.innerHTML;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        payButton.disabled = true;
    }
    
    try {
        // Simular procesamiento de pago
        console.log('🎫 Simulando compra con datos:', customerData);
        
        // Simular delay de procesamiento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simular respuesta exitosa de MercadoPago
        const mockPaymentId = 'ECO-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const mockStatus = 'approved';
        
        // Guardar datos en localStorage para la página de agradecimiento
        const purchaseData = {
            ...customerData,
            paymentId: mockPaymentId,
            status: mockStatus,
            purchaseDate: new Date().toISOString()
        };
        
        localStorage.setItem('purchaseData', JSON.stringify(purchaseData));
        
        // Simular envío de email con QR
        console.log('🎫 Simulando envío de email con QR...');
        console.log('📧 Email enviado a:', customerData.email);
        console.log('🎟️ QR generado para:', mockPaymentId);
        console.log('✅ Estado del pago: APROBADO');
        
        // Redirigir a página de agradecimiento
        window.location.href = 'gracias.html';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al procesar el pago. Por favor intenta nuevamente.');
    } finally {
        // Restaurar botón
        if (payButton) {
            payButton.innerHTML = originalText;
            payButton.disabled = false;
        }
    }
}

// Función para validar formulario
function validateForm() {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'quantity'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    });
    
    if (!isValid) {
        alert('Por favor, completa todos los campos obligatorios.');
    }
    
    return isValid;
}

// Función para mostrar sección de pago
function showPaymentSection() {
    document.getElementById('paymentSection').style.display = 'block';
    
    // Actualizar información de pago
    const ticketNames = {
        'general': 'Entrada General'
    };
    
    document.getElementById('paymentTicketType').textContent = ticketNames[selectedTicket];
    document.getElementById('paymentQuantity').textContent = selectedQuantity;
    document.getElementById('paymentUnitPrice').textContent = `$${selectedPrice}`;
    document.getElementById('paymentTotal').textContent = `$${selectedPrice * selectedQuantity}`;
    
    // Scroll a la sección de pago
    document.getElementById('paymentSection').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Función para crear preferencia de pago (solo si hay backend disponible)
async function createPaymentPreference() {
    try {
        // Mostrar loading
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
        
        // Intentar crear preferencia en el backend (modo producción)
        // Si falla, se usará el modo demo automáticamente
        const response = await fetch('/api/create-preference', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: [{
                    title: `Entrada TechConf 2024 - ${customerData.ticketType}`,
                    quantity: customerData.quantity,
                    unit_price: customerData.price
                }],
                customer: {
                    name: `${customerData.firstName} ${customerData.lastName}`,
                    email: customerData.email,
                    phone: customerData.phone
                },
                metadata: {
                    ticketType: customerData.ticketType,
                    quantity: customerData.quantity,
                    customerEmail: customerData.email
                }
            })
        });
        
        const preference = await response.json();
        
        // Renderizar botón de MercadoPago solo si está disponible
        if (mp && mp.bricks) {
            mp.bricks().create("wallet", "mercadopago-checkout", {
                initialization: {
                    preferenceId: preference.id,
                },
                callbacks: {
                    onReady: () => {
                        console.log('MercadoPago listo');
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                    },
                    onSubmit: () => {
                        console.log('Pago iniciado');
                    },
                    onError: (error) => {
                        console.error('Error en MercadoPago:', error);
                        if (loadingOverlay) loadingOverlay.style.display = 'none';
                        alert('Error al procesar el pago. Por favor, intenta nuevamente.');
                    }
                },
            });
        } else {
            // Si no hay MercadoPago, usar modo demo
            if (loadingOverlay) loadingOverlay.style.display = 'none';
            console.log('Backend no disponible, usando modo demo');
            processPayment(); // Usar la función de simulación
        }
        
    } catch (error) {
        console.log('Backend no disponible, usando modo demo:', error.message);
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        // No mostrar error, usar modo demo automáticamente
        processPayment(); // Usar la función de simulación
    }
}

// Función para manejar el resultado del pago
function handlePaymentResult(status) {
    switch (status) {
        case 'approved':
            showSuccessMessage();
            break;
        case 'pending':
            showPendingMessage();
            break;
        case 'rejected':
            showRejectedMessage();
            break;
        default:
            console.log('Estado de pago:', status);
    }
}

// Función para mostrar mensaje de éxito
function showSuccessMessage() {
    const message = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h2>¡Pago Aprobado!</h2>
            <p>Tu compra ha sido procesada exitosamente. Recibirás un correo electrónico con tus entradas y códigos QR en breve.</p>
            <button onclick="window.location.href='index.html'" class="cta-button">
                Volver al Inicio
            </button>
        </div>
    `;
    
    document.querySelector('.purchase-content').innerHTML = message;
}

// Función para mostrar mensaje pendiente
function showPendingMessage() {
    const message = `
        <div class="pending-message">
            <i class="fas fa-clock"></i>
            <h2>Pago Pendiente</h2>
            <p>Tu pago está siendo procesado. Te notificaremos por correo electrónico una vez que se confirme.</p>
            <button onclick="window.location.href='index.html'" class="cta-button">
                Volver al Inicio
            </button>
        </div>
    `;
    
    document.querySelector('.purchase-content').innerHTML = message;
}

// Función para mostrar mensaje rechazado
function showRejectedMessage() {
    const message = `
        <div class="rejected-message">
            <i class="fas fa-times-circle"></i>
            <h2>Pago Rechazado</h2>
            <p>Tu pago no pudo ser procesado. Por favor, verifica tus datos e intenta nuevamente.</p>
            <button onclick="location.reload()" class="cta-button">
                Intentar Nuevamente
            </button>
        </div>
    `;
    
    document.querySelector('.purchase-content').innerHTML = message;
}

// Función para simular compra
async function simulatePurchase() {
    // Llenar automáticamente el formulario con datos de prueba
    document.getElementById('firstName').value = 'Juan';
    document.getElementById('lastName').value = 'Pérez';
    document.getElementById('email').value = 'juan.perez@ejemplo.com';
    document.getElementById('phone').value = '3791234567';
    document.getElementById('quantity').value = '3';
    
    // Seleccionar automáticamente la entrada general si no está seleccionada
    if (!selectedTicket) {
        selectedTicket = 'general';
        selectedPrice = 10000;
        document.querySelector('.ticket-option').classList.add('selected');
        document.getElementById('customerForm').style.display = 'block';
        updateTicketInfo();
    }
    
    // Calcular total
    calculateTotal();
    
    // Esperar un momento y luego procesar el pago
    setTimeout(() => {
        processPayment();
    }, 1000);
}

// Manejar parámetros de URL para resultado de pago
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    
    if (status) {
        handlePaymentResult(status);
    }
});

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#4ecdc4';
            } else {
                this.style.borderColor = '#e5e7eb';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#4ecdc4';
            }
            
            // Validación especial para el input de cantidad
            if (this.id === 'quantity') {
                const value = parseInt(this.value);
                if (value < 1) {
                    this.value = 1;
                } else if (value > 20) {
                    this.value = 20;
                }
                calculateTotal();
            }
        });
    });
});
