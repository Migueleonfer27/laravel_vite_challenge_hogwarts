const buildPage = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6 p-2">
                    <h3 class="text-center text-light mb-4">Modificar contraseña</h3>
                    <form id="change-password-form" class="p-4" novalidate>
                        <div class="mb-3">
                            <label for="email" class="form-label text-light">Correo Electrónico</label>
                            <input type="email" class="form-control" id="email" name="email" required data-link="/">
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label text-light">Contraseña</label>
                            <input type="password" class="form-control" id="password" name="password" required minlength="6" maxlength="6">
                        </div>
                        <button type="submit" class="btn w-100" id="modify">Modificar</button>
                         <div id="loader" class="loader pt-2" style="display: none;"></div> 
                         <div id="message" class="text-light text-center mt-2" style="display: none;"></div>
                    </form>
                </div>
               
            </div>
        </div>
    `;
    addValidation()
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


export const addEnlaceEvent = () => {
    buildPage()
}

