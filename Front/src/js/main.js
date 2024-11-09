import { loadPage } from './router.js'

// Import our custom CSS
import '../scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

document.addEventListener('click', (e) => {
    // Busca el elemento <a> o <button> con el atributo `data-link`
    const linkElement = e.target.closest('a[route-link], button[route-link]');
    if (linkElement) {
        e.preventDefault();
        const path = linkElement.getAttribute('route-link'); // Obtén la ruta desde `route-link`
        loadPage(path);
    }
});


loadPage(window.location.pathname);