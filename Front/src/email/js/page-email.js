import '../scss/styles.scss'
import { updatePassword } from "./email-provider.js";
import { buildHeader } from "../../components/buildHeader.js"
import { buildFooter } from "../../components/buildFooter";

const buildPage = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6 p-2">
                    <h3 class="text-center text-light mb-4">Modificar contraseña</h3>
                    <div id="form-container" class="p-4 text-center">
                        <form id="change-password-form" class="pb-3" novalidate>
                            <div class="mb-3">
                                <label for="email" class="form-label text-light">Correo Electrónico</label>
                                <input type="email" class="form-control" id="email" name="email" required route-link="/">
                            </div>
                            <div class="mb-3">
                                <label for="password" class="form-label text-light">Contraseña</label>
                                <input type="password" class="form-control" id="password" name="password" required minlength="6" maxlength="6">
                            </div>
                            <button type="submit" class="btn w-100 modify">Modificar</button>
                        </form>
                        <div id="loader" class="loader pt-2" style="display: none;"></div> 
                        <div id="message" class="text-light text-center mt-2" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    addValidation()
    addEventSubmit()
}

const addValidation = () => {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');

    // Validación del campo de correo en tiempo real
    emailInput.addEventListener('input', () => {
        if (!emailInput.value === '') {
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'Por favor, introduce un correo electrónico válido.';
        } else {
            messageDiv.style.display = 'none';
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length !== 6) {
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'La contraseña debe tener exactamente 6 caracteres.';
        } else {
            messageDiv.style.display = 'none';
        }
    });
};

const addEventSubmit = () => {
    const form = document.getElementById('change-password-form');
    const messageDiv = document.getElementById('message')
    const loader = document.getElementById('loader');


    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            loader.style.display = 'block';
            messageDiv.style.display = 'none'

            const {response, text} = await updatePassword(email, password)

            if(response === 'ok'){
                form.hidden = true;
                messageDiv.textContent = text;
                messageDiv.style.display = 'block';

                const formContainer = document.getElementById('form-container');
                const button = document.createElement('button');
                button.textContent = 'Volver al inicio';
                button.className = 'modify mt-4';
                button.addEventListener('click', () => {
                    window.location.href = '../../index.html'
                })
                formContainer.appendChild(button);

            }else if(response === 'error'){
                messageDiv.textContent = text;
                messageDiv.style.display = 'block';
            }
            loader.style.display = 'none';

        });
    }
};

buildHeader()
buildPage()
buildFooter()