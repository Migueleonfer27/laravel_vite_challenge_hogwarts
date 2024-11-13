import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import {buildFooter} from "../../../components/buildFooter";

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('admin-button').addEventListener('click', () => {
        window.location.href = 'admin-user.html'; // Asegúrate de que la ruta sea correcta
    });

    // Incluye la construcción del header y footer aquí
    buildHeader();
    buildFooter();
});
