// Import our custom CSS
import '../scss/styles.scss'
import { loadPage } from './router.js'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

//import { initAuth } from "../auth/page-auth";

//initAuth();

document.addEventListener('click', (e) => {
    // Busca el elemento <a> o <button> más cercano con el atributo `data-link`
    const linkElement = e.target.closest('a[data-link], button[data-link]');

    if (linkElement) {
        e.preventDefault(); // Evita el comportamiento por defecto
        const path = linkElement.getAttribute('data-link'); // Obtén la ruta desde `data-link`
        loadPage(path); // Llama a la función `loadPage` con la ruta
    }
});


loadPage(window.location.pathname);