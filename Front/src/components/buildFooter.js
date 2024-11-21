import '../scss/componets.scss'
export const buildFooter = (idContainer) => {
    const container = document.querySelector(idContainer || '#footer-container');
    container.innerHTML = `
        <footer id='footer' class="p-3 fixed-bottom">
            <div class="container d-flex justify-content-between align-items-center">
                <span class="text-muted text-shadow-person fs-5">&copy; 2024 Hogwarts</span>
                <div class="d-flex">
                    <a href="https://github.com/Migueleonfer27" class="btn text-muted me-3 text-shadow-person fs-3"><i class="bi bi-github"></i></a>
                    <a href="https://github.com/cynthia2811" class="btn text-muted me-3 text-shadow-person fs-3"><i class="bi bi-github"></i></a>
                    <a href="https://github.com/moonmdc" class="btn text-muted text-shadow-person fs-3"><i class="bi bi-github"></i></a>
                </div>
            </div>
        </footer>
    `;
}