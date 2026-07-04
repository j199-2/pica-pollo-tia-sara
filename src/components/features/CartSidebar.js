window.addToCart = function(productId) {

// Estado global del carrito (arreglo temporal en la memoria)
let cart = [];

// Hacemos que la función esté disponible globalmente para los botones de las tarjetas
window.addToCart = async function(productId) {
    // Si el carrito está vacío o no sabemos los productos, pedimos el JSON
    if (window.allMenuData === undefined) {
        const response = await fetch('/src/data/menu.json');
        window.allMenuData = await response.json();
    }
    
    const product = window.allMenuData.find(p => p.id === productId);
    if (!product) return;

    // Verificamos si ya está en el carrito para sumar cantidad
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.cantidad += 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }
    
    renderCart();
    openCart(); // Abre el carrito automáticamente
};

// Función para inyectar la estructura HTML del carrito en la página
export function loadCartSidebar() {
    const placeholder = document.getElementById('cart-placeholder');
    if (!placeholder) return;

    placeholder.innerHTML = `
        <div class="cart-overlay" id="cartOverlay"></div>
        <div class="cart-sidebar" id="cartSidebar">
            <div class="cart-header">
                <h3>Tu Pedido</h3>
                <button id="closeCart" class="close-btn">&times;</button>
            </div>
            <div class="cart-body" id="cartBody">
                <!-- Aquí se inyectarán los productos dinámicamente -->
            </div>
            <div class="cart-footer" id="cartFooter" style="display: none;">
                <p class="cart-total">Total: <strong id="cartTotal">$0.00</strong></p>
                <button class="btn btn-primary" id="checkoutBtn" style="width: 100%;">Enviar por WhatsApp</button>
            </div>
        </div>
    `;

    // Eventos para abrir y cerrar
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    
    // El botón del carrito en el navbar (que inyectamos antes)
    const cartToggle = document.getElementById('cartToggle');
    if(cartToggle) cartToggle.addEventListener('click', openCart);
}

// Dibuja los productos dentro del carrito
function renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount'); // El numerito de arriba en el navbar
    
    if (cart.length === 0) {
        cartBody.innerHTML = '<p class="empty-cart">Tu carrito está vacío.</p>';
        cartFooter.style.display = 'none';
        if(cartCount) cartCount.innerText = '0';
        return;
    }

    let total = 0;
    let totalItems = 0;
    
    cartBody.innerHTML = cart.map(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        totalItems += item.cantidad;
        
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toFixed(2)} x ${item.cantidad}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="changeQty(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button onclick="changeQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.innerText = `$${total.toFixed(2)}`;
    cartFooter.style.display = 'block';
    if(cartCount) cartCount.innerText = totalItems;
}

// Funciones globales para los botones de cantidad y eliminar
window.changeQty = (id, change) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.cantidad += change;
        if (item.cantidad <= 0) cart = cart.filter(i => i.id !== id);
        renderCart();
    }
};

window.removeItem = (id) => {
    cart = cart.filter(i => i.id !== id);
    renderCart();
};

function openCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if(sidebar) sidebar.classList.add('active');
    if(overlay) overlay.classList.add('active');
}

function closeCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if(sidebar) sidebar.classList.remove('active');
    if(overlay) overlay.classList.remove('active');
}
