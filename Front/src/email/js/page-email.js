const updatePassword = () => {
    const mainContent = document.querySelector('#main-container');
        mainContent.innerHTML = `<div id="main-container" class="container">
        <h2 id="title">Actualizar Contraseña</h2>
        <form id="change-password-form">
            <div>
                <label for="email">Correo Electrónico</label>
                <input type="email" id="email" name="email" placeholder="Tu correo electrónico" required>
            </div>
            <div>
                <label for="new_password">Nueva Contraseña</label>
                <input type="password" id="new_password" name="new_password" placeholder="Nueva contraseña (6 caracteres)" required>
            </div>
            <button type="submit">Actualizar Contraseña</button>
        </form>
        <div id="response-message"></div> <!-- Mensaje de éxito o error -->
    </div>`;
    }
export const addEnlaceEvent = () => {
    const enlace = document.querySelector('#password');
        enlace.addEventListener('click',(e) =>{
        e.preventDefault()
        updatePassword()
    });
}

