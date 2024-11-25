export const showLoader = (idContainer, timeout) => {
    setTimeout(function() {
        document.querySelector(idContainer || '#loader-container').classList.remove('d-none');
    }, timeout ? timeout : 250);
}

export const hideLoader = (idContainer, timeout) => {
    setTimeout(function() {
        document.querySelector(idContainer || '#loader-container').classList.add('d-none');
    }, timeout ? timeout : 250);
}

export const buildLoader = (idContainer) => {
    const container = document.querySelector(idContainer || '#loader-container');
    container.classList.add('loader-active','d-flex','justify-content-center','align-items-center')
    container.innerHTML = `
        <div class="loader"></div>
    `;
}