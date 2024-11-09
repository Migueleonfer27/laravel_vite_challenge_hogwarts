export const buildFooter = (idContainer) => {
    const container = document.querySelector(idContainer || '#footer-container');
    container.innerHTML = `
        <footer class="bg-body-tertiary p-3 fixed-bottom">
            <div class="container d-flex justify-content-between align-items-center">
                <span class="text-muted">&copy; 2024 Hogwarts</span>
                <div>
                    <a href="https://github.com/Migueleonfer27" class="text-muted me-3"><i class="bi bi-github"></i></a>
                    <a href="https://github.com/cynthia2811" class="text-muted me-3"><i class="bi bi-github"></i></a>
                    <a href="https://github.com/moonmdc" class="text-muted"><i class="bi bi-github"></i></a>
                </div>
            </div>
        </footer>
    `;
}