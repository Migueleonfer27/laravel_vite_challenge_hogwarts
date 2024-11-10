import '../scss/styles.scss'
export const buildHeader = (idContainer) => {
    const container = document.querySelector(idContainer || '#header-container');
    const imageURL = new URL('../assets/img/icon_hogwarts.png', import.meta.url);

    container.innerHTML = `
        <nav id="navbar" class="navbar navbar-expand-lg sticky-top">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="${imageURL}" alt="Icon" width="100" height="100" class="me-2">
                    Hogwarts
                </a>
            </div>
        </nav>
    `;
}
