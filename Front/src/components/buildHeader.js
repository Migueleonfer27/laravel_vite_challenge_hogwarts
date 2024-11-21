import '../scss/styles.scss'
import {handleLogout} from "../auth/auth-provider";
import {buildNavIngredients} from "./buildNavIngredients";

export const buildHeader = (idContainer) => {
    const container = document.querySelector(idContainer || '#header-container');
    const imageURL = new URL('../assets/img/icon_hogwarts.png', import.meta.url);
    const name = localStorage.getItem('name');

    container.innerHTML = `
        <nav id="navbar" class="navbar navbar-expand-lg sticky-top">
            <div class="container-fluid">
                <div class="d-flex align-items-center w-100">
                    <a class="navbar-brand d-flex align-items-center" href="/">
                        <img src="${imageURL}" alt="Icon" class="me-4" style="width: 15%; height: 15%;">
                        <span class="text-shadow-person fs-1">Hogwarts</span>
                    </a>
                    <button class="navbar-toggler ms-auto bg-primary-person text-hepta-person" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
                <div class="collapse navbar-collapse" id="navbarContent">
                    <div class="ms-auto d-flex align-items-center justify-content-end">
                        <img id="photo" class="object-fit-contain me-3 d-none" src="../assets/img/user.png" alt="img-user" width="6%" height="6%">
                        <span id="name" class="text-primary-person me-3 d-none text-shadow-person fs-5">Bienvenido, ${name}</span>
                        <a href="/">
                            <i id="logoutBtn" class="bi bi-door-closed-fill btn text-primary-person text-shadow-person fs-1 d-none"></i>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    buildNavIngredients('#header-container');
    showUser();
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

const showUser = () => {
    const name = document.querySelector('#name');
    const photo = document.querySelector('#photo');
    const logoutBtn = document.getElementById('logoutBtn');

    if (localStorage.getItem('name') !== null) {
        name.classList.remove('d-none');
        photo.classList.remove('d-none');
        logoutBtn.classList.remove('d-none');
    } else {
        name.classList.add('d-none');
        photo.classList.add('d-none');
        logoutBtn.classList.add('d-none');
    }
}

const setupLogoutBtn = () => {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}