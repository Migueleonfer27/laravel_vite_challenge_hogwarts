import '../scss/styles.scss'
import {handleLogout} from "../auth/auth-provider";
import {buildNavIngredients} from "./buildNavIngredients";

export const buildHeader = (idContainer) => {
    const container = document.querySelector(idContainer || '#header-container');
    const imageURL = new URL('../assets/img/icon_hogwarts.png', import.meta.url);
    const name = localStorage.getItem('name');

    container.innerHTML = `
        <nav id="navbar" class="navbar sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="${imageURL}" alt="Icon" width="115" height="115" class="me-4">
                    Hogwarts
                </a>
                <div class="d-flex align-items-center">
                    <span id="name" class="text-primary-person me-3 d-none fs-5">Bienvenido, ${name}</span>
                <a href="/">
                    <button id="logoutBtn" class="logout-btn btn ms-auto">Cerrar sesión</button>
                </a>
                </div>
            </div>
        </nav>
    `;
    buildNavIngredients('#header-container');
    showName();
    setupLogoutBtn();
}

export const showLogoutButton = () => {
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.style.display = 'block'; // Muestra el botón
    }
}

export const hideLogoutButton = () => {
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.style.display = 'none'; // Oculta el botón
    }
}

const showName = () => {
    const name = document.querySelector('#name');

    if (localStorage.getItem('name') !== null) {
        name.classList.remove('d-none');
    } else {
        name.classList.add('d-none');
    }
}

const setupLogoutBtn = () => {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}