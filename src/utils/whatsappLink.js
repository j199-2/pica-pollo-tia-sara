/**
 * Genera un enlace de WhatsApp con el pedido del carrito formateado
 * @param {string} phone - Número de WhatsApp de la sucursal (ej: '5355551234')
 * @param {Array} cartItems - Array de objetos del carrito {nombre, cantidad, precio}
 * @returns {string} URL completa para abrir WhatsApp
 */
export function generateWhatsAppLink(phone, cartItems = []) {
  let message = "¡Hola Tía Sara! Quiero hacer un pedido:\n\n";
  
  let total = 0;
  cartItems.forEach(item => {
    const subtotal = item.cantidad * item.precio;
    message += `- ${item.cantidad}x ${item.nombre} ($${subtotal.toFixed(2)})\n`;
    total += subtotal;
  });
  
  message += `\nTotal estimado: $${total.toFixed(2)}`;
  message += "\n\n¡Gracias, espero mi pedido!";

  // Codificamos el mensaje para que WhatsApp entienda los saltos de línea y caracteres especiales
  const encodedMessage = encodeURIComponent(message);
  
  // Retornamos el enlace completo
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}
