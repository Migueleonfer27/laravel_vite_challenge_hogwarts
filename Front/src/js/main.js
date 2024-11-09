// Import our custom CSS
import '../scss/styles.scss'
import { loadPage } from './router.js'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

document.addEventListener('click', (e) => {
    // Busca el elemento <a> o <button> más cercano con el atributo `data-link`
    const linkElement = e.target.closest('a[data-link], button[data-link]');

    if (linkElement) {
        e.preventDefault();
        const path = linkElement.getAttribute('data-link'); // Obtén la ruta desde `data-link`
        loadPage(path);
    }
});

// Escucha el evento `popstate` para manejar la navegación con los botones de retroceso y adelante
window.addEventListener('popstate', () => {
    loadPage(window.location.pathname);
});


loadPage(window.location.pathname);