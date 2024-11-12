import { handleRegister, handleLogin, handleLogout } from "./auth-provider";
import { getToken } from "../../storage/tokenManager";
import { loadPage } from "../js/router";
import { buildHeader } from "../components/buildHeader";
import { hideLogoutButton } from "../components/buildHeader";
import { buildFooter } from "../components/buildFooter";
import { initializeDragAndDrop } from "../houses/drag-and-drop-house";

// Miguel León Fernández
export const initAuth = () => {
    buildHeader();
    hideLogoutButton()
    buildFooter();
    addWelcome();
    addOwl();
    addLoginForm();
    addFormButtons();
    toggleAuthButtons(getToken() !== null);
}

// Miguel León Fernández
const addWelcome = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
    <div class="container mt-5">
      <div class="card text-center text-primary-person shadow-lg p-4 bg-cuaternary-person border-2 border-primary-person">
        <h1 class="card-title">¡Bienvenido a la Academia Howarts!</h1>
        <p class="card-text mt-3">Nos alegra darte la bienvenida a un lugar mágico donde podrás aprender y desarrollar tus habilidades. Prepárate para vivir experiencias inolvidables y descubrir todos los secretos que Howarts tiene para ofrecerte. ¡Que comience la aventura!</p>
      </div>
    </div>
    `;
}

// Miguel León Fernández
const addOwl = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML += `
        <div class="container mt-5">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6 d-none d-md-block owl-container">
                    <img src="./assets/img/lechuza.png" alt="Imagen de Registro" class="img-fluid animated-owl" width="75%">
                </div>
                <div class="col-md-6 form-container" id="form-container">
                </div>
            </div>
        </div>
    `;
}

// Miguel León Fernández
const addFormButtons = () => {
    const formContainer = document.querySelector('#form-container');
    if (!document.querySelector('#authBtn')) {
        const authBtnContainer = document.createElement('div');
        authBtnContainer.id = 'authBtn';
        authBtnContainer.classList.add('d-flex', 'justify-content-evenly', 'ms-auto');

        authBtnContainer.innerHTML = `
            <button id="loginBtn" class="btn w-50">Inicio de sesión</button>
            <button id="registerBtn" class="btn w-50">Registrarse</button>
        `;

        formContainer.prepend(authBtnContainer);
    }
    selectForm();
};

// Miguel León Fernández
const addRegisterForm = () => {
    const formContainer = document.querySelector('#form-container');
    formContainer.innerHTML = `
        <div class="bg-cuaternary-person p-5">
            <h3 class="text-center text-primary-person mb-4">Registro de Alumno</h3>
            <form id="registerForm">
                <div class="mb-3">
                    <label for="nameUser" class="form-label text-primary-person">Nombre</label>
                    <input type="text" class="form-control bg-primary-person" id="nameUser" name="nameUser" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label text-primary-person">Correo Electrónico</label>
                    <input type="email" class="form-control bg-primary-person" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label text-primary-person">Contraseña</label>
                    <input type="password" class="form-control bg-primary-person" id="password" name="password" required minlength="6">
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label text-primary-person">Confirmar contraseña</label>
                    <input type="password" class="form-control bg-primary-person" id="confirmPassword" name="confirmPassword" required minlength="6">
                </div>
                <div class="mb-3 d-flex justify-content-center">
                    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#housesModal">
                      Seleccionar casa
                    </button>
                </div>
                <div class="form-check d-flex justify-content-center mb-3">
                  <label class="form-check-label text-primary-person" for="noPreference">
                    No seleccionar preferencias de casa
                  </label>
                  <input class="form-check-input ms-2" type="checkbox" value="" id="noPreference">
                </div>
                <div class="modal fade" id="housesModal" tabindex="-1" aria-labelledby="housesModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content bg-cuaternary-person">
                      <div class="modal-header">
                        <h5 class="modal-title text-primary-person" id="housesModalLabel">Preferencias de Casa</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body bg-primary-person">
                        <div class="row justify-content-center">
                            <div id="preference-1" class="col-12 col-md-3 mb-3 d-flex flex-column align-items-center dropzone">
                                <img src="../assets/img/gryffindor.png" class="img-fluid rounded img-houses" alt="gryffindor" draggable="true">
                                <span class="mt-3 text-primary-person fs-3 fw-bold bg-hepta-person px-4 rounded-5">1</span>
                            </div>
                            <div id="preference-2" class="col-12 col-md-3 mb-3 d-flex flex-column align-items-center dropzone">
                                <img src="../assets/img/hufflepuff.png" class="img-fluid rounded img-houses" alt="hufflepuff" draggable="true">
                                <span class="mt-3 text-primary-person fs-3 fw-bold bg-hepta-person px-4 rounded-5">2</span>
                            </div>
                            <div id="preference-3" class="col-12 col-md-3 mb-3 d-flex flex-column align-items-center dropzone">
                                <img src="../assets/img/ravenclaw.png" class="img-fluid rounded img-houses" alt="ravenclaw" draggable="true">
                                <span class="mt-3 text-primary-person fs-3 fw-bold bg-hepta-person px-4 rounded-5">3</span>
                            </div>
                            <div id="preference-4" class="col-12 col-md-3 mb-3 d-flex flex-column align-items-center dropzone">
                                <img src="../assets/img/slytherin.png" class="img-fluid rounded img-houses" alt="slytherin" draggable="true">
                                <span class="mt-3 text-primary-person fs-3 fw-bold bg-hepta-person px-4 rounded-5">4</span>
                            </div>
                        </div>
                    </div>
                      <div class="modal-footer">
                        <button type="button" class="btn" data-bs-dismiss="modal">Cerrar</button>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" class="btn w-100">Registrar</button>
            </form>
        </div>
    `;
    addFormButtons();
    handleRegister();
    initializeDragAndDrop();
};

// Miguel León Fernández
const addLoginForm = () => {
    const formContainer = document.querySelector('#form-container');
    formContainer.innerHTML = `
        <div class="bg-cuaternary-person p-5">
            <h3 class="text-center text-primary-person mb-4">Inicio de sesión</h3>
            <form id="loginForm">
                <div class="mb-3">
                    <label for="email" class="form-label text-primary-person">Correo Electrónico</label>
                    <input type="email" class="form-control bg-primary-person" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label text-primary-person">Contraseña</label>
                    <input type="password" class="form-control bg-primary-person" id="password" name="password" required minlength="6">
                </div>
                <div class="mt-3 text-center mb-2">
                    <a route-link="/email" href="#" class="text-primary-person text-decoration-none">¿Has olvidado tu contraseña?</a>
                </div>
                <button type="submit" class="btn w-100">Iniciar sesión</button>
            </form>
        </div>
    `;
    addFormButtons();
    handleLogin(() => {
        loadPage('/')
    });
};

// Miguel León Fernández
const selectForm = () => {
    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn');

    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addLoginForm();
    });

    registerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addRegisterForm();
    });
};

// Miguel León Fernández
export const toggleAuthButtons = (isLoggedIn) => {
    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn');
    const logoutBtn = document.querySelector('#logoutBtn');

    if (isLoggedIn) {
        loginBtn.classList.add('d-none');
        registerBtn.classList.add('d-none');
        logoutBtn.classList.remove('d-none');
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
            toggleAuthButtons(false);
        });
    } else {
        loginBtn.classList.remove('d-none');
        registerBtn.classList.remove('d-none');
        logoutBtn.classList.add('d-none');
    }
};

// Miguel León Fernández
export const showMessageError = (status, errors) => {
    const existingError = document.querySelector('#errorDiv');
    if (existingError) existingError.remove();

    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorDiv';
    errorDiv.className = 'alert alert-danger mt-3 text-center';

    let message = '';

    if (status === 401) {
        message = 'Credenciales incorrectas. Verifica tu correo y contraseña.';
    } else if (status === 422 && errors) {
        message = 'Por favor, corrige los siguientes errores:<br>';
        for (const field in errors) {
            message += `${errors[field].join('<br>')}<br>`;
        }
    } else if (status === 500) {
        message = 'Error de conexión, inténtelo más tarde.';
    } else {
        message = 'Ocurrió un error desconocido. Póngase en contacto con el administrador.';
    }

    errorDiv.innerHTML = message;

    const form = document.querySelector('#loginForm') || document.querySelector('#registerForm');
    if (form) form.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
};

// Miguel León Fernández
export const showSuccessMessage = (message) => {
    const existingMessage = document.querySelector('#successDiv');
    if (existingMessage) existingMessage.remove();

    const successDiv = document.createElement('div');
    successDiv.id = 'successDiv';
    successDiv.className = 'alert alert-success mt-3 text-center';
    successDiv.innerHTML = message;

    const form = document.querySelector('#registerForm');
    if (form) form.appendChild(successDiv);

    setTimeout(() => {
        successDiv.remove();
    }, 5000);
};
