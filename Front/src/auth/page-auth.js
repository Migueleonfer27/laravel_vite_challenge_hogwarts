import { handleRegister, handleLogin, handleLogout } from "./auth-provider";
import { getToken } from "../../storage/tokenManager";

// Miguel León Fernández
export const initAuth = () => {
    addWelcome();
    addOwl();
    selectForm();
    toggleAuthButtons(getToken() !== null);
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
const addWelcome = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
    <div class="container mt-5">
      <div class="card text-center text-light shadow-lg p-4 bg-secondary">
        <h1 class="card-title">¡Bienvenido a la Academia Howarts!</h1>
        <p class="card-text mt-3">Nos alegra darte la bienvenida a un lugar mágico donde podrás aprender y desarrollar tus habilidades. Prepárate para vivir experiencias inolvidables y descubrir todos los secretos que Howarts tiene para ofrecerte. ¡Que comience la aventura!</p>
      </div>
    </div>
    `
}

// Miguel León Fernández
const addRegisterForm = () => {
    const formContainer = document.querySelector('#form-container');
    formContainer.innerHTML = `
        <div class="bg-secondary p-5">
            <h3 class="text-center text-light mb-4">Registro de Alumno</h3>
            <form id="registerForm">
                <div class="mb-3">
                    <label for="name" class="form-label text-light">Nombre</label>
                    <input type="text" class="form-control" id="name" name="name" required>
                </div>
                <div class="mb-3">
                    <label for="email" class="form-label text-light">Correo Electrónico</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label text-light">Contraseña</label>
                    <input type="password" class="form-control" id="password" name="password" required minlength="6">
                </div>
                <button type="submit" class="btn btn-primary w-100">Registrar</button>
            </form>
        </div>
    `;
    handleRegister();
};

// Miguel León Fernández
const addLoginForm = () => {
    const formContainer = document.querySelector('#form-container');
    formContainer.innerHTML = `
        <div class="bg-secondary p-5">
            <h3 class="text-center text-light mb-4">Inicio de sesión</h3>
            <form id="loginForm">
                <div class="mb-3">
                    <label for="email" class="form-label text-light">Correo Electrónico</label>
                    <input type="email" class="form-control" id="email" name="email" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label text-light">Contraseña</label>
                    <input type="password" class="form-control" id="password" name="password" required minlength="6">
                </div>
                <div class="mt-3 text-center mb-2">
                    <a href="email/email.html" class="text-light text-decoration-none">¿Has olvidado tu contraseña?</a>
                </div>
                <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
            </form>
        </div>
    `;
    handleLogin();
};

// Miguel León Fernández
export const selectForm = () => {
    const loginBtn = document.querySelector('#loginBtn');
    const registerBtn = document.querySelector('#registerBtn');

    addLoginForm();

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
export const showMessageError = (error) => {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'errorDiv';

    const message = error === 'Unauthorized' ? 'Usuario o contraseña incorrectos.' : 'Error de conexión, inténtelo más tarde.';

    errorDiv.innerHTML = `
        <div class="alert alert-danger mt-3 text-center" role="alert">
          ${message}
        </div>
    `;

    if (!document.querySelector('#errorDiv')) {
        document.querySelector('#loginForm').appendChild(errorDiv);
    }

    setTimeout(() => {
        errorDiv.remove();
    }, 4000);
}