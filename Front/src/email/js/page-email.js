import '../../scss/email.scss';
import {changePassword} from "./email-provider.js";
import { buildHeader } from "../../components/buildHeader.js";
import { buildFooter } from "../../components/buildFooter";

const buildPage = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center align-items-center">
                <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 p-3">
                    <div id="form-container" class="p-4 text-center rounded-3 border bg-octa-person">
                        <h3 class="text-center text-primary-person mb-4 text-shadow-person">Modificar contraseña</h3>
                        <form id="change-password-form" class="pb-3" novalidate>
                            <div class="mb-3">
                                <label for="email" class="form-label text-primary-person text-shadow-person">Correo Electrónico</label>
                                <input type="email" class="form-control bg-primary-person" id="email" name="email" required route-link="/">
                            </div>
                            <button type="submit" class="btn w-100 modify text-primary-person text-shadow-person">Modificar</button>
                        </form>
                        <div id="loader" class="loader pt-2" style="display: none;"></div>
                        <div id="message" class="text-primary-person text-center text-shadow-person bg-hepta-person border rounded-3 mt-2 p-3" style="display: none;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    addValidation();
    addEventSubmit();
};

const addValidation = () => {
    const emailInput = document.getElementById('email');
    const messageDiv = document.getElementById('message');

    // Validación del campo de correo en tiempo real
    emailInput.addEventListener('input', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'Por favor, introduce un correo electrónico válido.';
        } else {
            messageDiv.style.display = 'none';
        }
    });
};

const addEventSubmit = () => {
    const form = document.getElementById('change-password-form');
    const messageDiv = document.getElementById('message');
    const loader = document.getElementById('loader');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;

            loader.style.display = 'block';
            messageDiv.style.display = 'none';

            const { response, text } = await changePassword(email);

            if (response === 'ok') {
                form.hidden = true;
                messageDiv.textContent = text;
                messageDiv.style.display = 'block';

                const formContainer = document.getElementById('form-container');
                const button = document.createElement('button');
                button.classList.add('btn');
                button.textContent = 'Volver al inicio';
                button.className = 'btn text-primary-person modify mt-4';
                button.addEventListener('click', () => {
                    window.location.href = '../../index.html';
                });
                formContainer.appendChild(button);
            } else if (response === 'error') {
                messageDiv.textContent = text;
                messageDiv.style.display = 'block';

                // Oculta el mensaje después de 2 segundos
                setTimeout(() => {
                    messageDiv.style.display = 'none';
                }, 2000);
            }

            loader.style.display = 'none';
        });
    }
};

buildHeader();
buildPage();
buildFooter();
