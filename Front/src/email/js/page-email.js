const updatePassword = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6">
                    <h3 class="text-center text-light mb-4">Actualizar contraseña</h3>
                    <form id="change-password-form">
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
            </div>
        </div>
    `;
}
    export const addEnlaceEvent = () => {
        const enlace = document.querySelector('#password');
        enlace.addEventListener('click', (e) => {
            e.preventDefault()
            updatePassword()
        });
    }

