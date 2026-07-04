/**
 * Genera el HTML de una tarjeta de producto para el menú
 * @param {Object} product - Objeto con los datos del producto (de menu.json)
 * @returns {string} Código HTML de la tarjeta
 */
export function createProductCard(product) {
  return `
    <div class="product-card">
        <div class="product-card-image">
            <!-- Si la foto real no existe, muestra un cuadro rojo con el nombre del plato -->
           <img src="/public/${product.imagen}"
                 alt="${product.nombre}" 
                 onerror="this.src='https://placehold.co/400x300/D32F2F/FFFFFF?text=${encodeURIComponent(product.nombre)}'">
        </div>
        <div class="product-card-info">
            <h3>${product.nombre}</h3>
            <p class="product-description">${product.descripcion}</p>
            <div class="product-card-footer">
                <span class="product-price">$${product.precio.toFixed(2)}</span>
                <button class="btn" onclick="addToCart(${product.id})">
                    Añadir 🛒
                </button>
            </div>
        </div>
    </div>
  `;
}
