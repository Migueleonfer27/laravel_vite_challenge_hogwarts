import '../scss/styles.scss'
export const buildHeader = (idContainer) => {
    const container = document.querySelector(idContainer || '#header-container');
    const imageURL = new URL('../assets/img/icon_hogwarts(2).png', import.meta.url);

    container.innerHTML = `
        <nav id="navbar" class="navbar sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="${imageURL}" alt="Icon" width="115" height="115" class="me-2">
                    Hogwarts
                </a>
                <a href="/">
                    <button id="logoutBtn" class="logout-btn btn ms-auto">Cerrar sesión</button>
                </a>
            </div>
        </nav>
    `;
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

