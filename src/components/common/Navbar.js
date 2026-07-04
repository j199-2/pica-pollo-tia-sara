/**
 * Función para cargar el menú de navegación dinámicamente
 */
export async function loadNavbar() {
  try {
    // Busca el lugar en la página donde irá el menú
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    // Descarga el HTML que creamos en el paso anterior
    const response = await fetch('./components/common/Navbar.html');
    const html = await response.text();
    
    // Lo inserta en la página
    placeholder.innerHTML = html;
    
    // --- LÓGICA DEL MENÚ HAMBURGUESA (Para celulares) ---
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    
    if(toggle && links) {
      toggle.addEventListener('click', () => {
        // Al hacer clic, le añade o le quita la clase 'active' para mostrarlo/ocultarlo
        links.classList.toggle('active');
        toggle.classList.toggle('active');
      });
    }
  } catch (error) {
    console.error("Error cargando el menú de Pica Pollo Tía Sara:", error);
  }
}
