import '../scss/styles.scss'
import {handleLogout} from "../auth/auth-provider";
import {buildNavIngredients} from "./buildNavIngredients";
import {changeColor} from "../houses/houseColors";

// Miguel León Fernández
// Cynthia
export const buildHeader = (idContainer) => {
    const container = document.querySelector(idContainer || '#header-container');

    if (!container) {
        console.error(`El contenedor con ID ${idContainer || '#header-container'} no existe.`);
        return;
    }

    const imageURL = new URL('../assets/img/icon_hogwarts.png', import.meta.url);
    const userURL = new URL('../assets/img/user.png', import.meta.url);
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
                <div class="navbar-collapse collapse" id="navbarContent">
                    <div class="ms-auto d-flex align-items-center justify-content-end">
                        <i id="backBtn" class="bi bi-arrow-bar-left me-3 btn text-primary-person text-shadow-person fs-1 d-none pointer-event"></i>                    
                        <img id="photo" class="object-fit-contain me-3 d-none border rounded-5 border-2 border-primary-person" src="${userURL}" alt="img-user" width="10%" height="10%">
                        <a href="/student-teacher/profile.html"><span id="name" class="text-primary-person text-center me-3 d-none text-shadow-person fs-6">Bienvenido, ${name}</span></a>
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
    backPage();
    changeColor(localStorage.getItem('house'));
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

// Miguel León Fernández
const showUser = () => {
    const name = document.querySelector('#name');
    const photo = document.querySelector('#photo');
    const logoutBtn = document.getElementById('logoutBtn');
    const backBtn = document.getElementById('backBtn');

    if (localStorage.getItem('name') !== null) {
        name.classList.remove('d-none');
        photo.classList.remove('d-none');
        logoutBtn.classList.remove('d-none');
        backBtn.classList.remove('d-none');
    } else {
        name.classList.add('d-none');
        photo.classList.add('d-none');
        logoutBtn.classList.add('d-none');
        backBtn.classList.add('d-none');
    }
}

// Miguel León Fernández
const setupLogoutBtn = () => {
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

// Miguel León Fernández
const backPage = () => {
    const btn = document.getElementById('backBtn');
    btn.addEventListener('click', (e) => {
        window.history.back();
    })
}