export const buildHeader = (idContainer) => {
    const container = document.querySelector(idContainer || '#header-container');
    container.innerHTML = `
        <nav id="navbar" class="navbar navbar-expand-lg bg-body-tertiary sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="../assets/img/icon_hogwarts.png" alt="Icon" width="100" height="100" class="me-2">
                    Hogwarts
                </a>
            </div>
        </nav>
    `;
}
