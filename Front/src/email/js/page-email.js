
const buildPage = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="container mt-5">
            <div class="row justify-content-center align-items-center">
                <div class="col-md-6 p-2">
                    <h3 class="text-center text-light mb-4">Modificar contraseña</h3>
                    <form id="change-password-form" class="p-4">
                        <div class="mb-3">
                            <label for="email" class="form-label text-light">Correo Electrónico</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label text-light">Contraseña</label>
                            <input type="password" class="form-control" id="password" name="password" required minlength="6" maxlength="6">
                        </div>
                        <button type="submit" class="btn w-100" id="modify">Modificar</button>
                         <div id="message" class="m-3 text-light md-6 p-2" style="display: none;"></div>
                    </form>
                </div>
               
            </div>
        </div>
    `;
}
export const addEnlaceEvent = () => {
    buildPage()
    const enlace = document.getElementById('email');
    enlace.addEventListener('click', (e) => {
        e.preventDefault()
    });
}

