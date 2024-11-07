import { handleRegister, handleLogin } from "./register-provider";

// Miguel León Fernández
const addRegisterForm = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h3 class="text-center mb-4">Registro de Alumno</h3>
                    <form id="registerForm">
                        <div class="mb-3">
                            <label for="name" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="name" name="name" required>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Correo Electrónico</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="password" name="password" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    handleRegister();
};

// Miguel León Fernández
const addLoginForm = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <h3 class="text-center mb-4">Inicio de sesión</h3>
                    <form id="loginForm">
                        <div class="mb-3">
                            <label for="email" class="form-label">Correo Electrónico</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="password" class="form-control" id="password" name="password" required minlength="6">
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    handleLogin();
};

// Miguel León Fernández
export const selectForm = () => {
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
