import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import {buildFooter} from "../../../components/buildFooter";

document.addEventListener('DOMContentLoaded', () => {
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href ='../../User/Admin/admin-user.html';
        });
    }

    buildHeader();
    buildFooter();
});




