import * as bootstrap from 'bootstrap';

// Miguel León Fernández
// Modificado Cynthia
export const showToastMessages = (message, isSuccess) => {
    // Se compueba si la pagina tiene contendedor de toast, si no, se añade
    const toastContainer = document.createElement('div')
    toastContainer.setAttribute('id', 'toast-container')
    toastContainer.classList.add('toast-container', 'position-fixed', 'bottom-0', 'end-0', 'p-3')
    if (!document.querySelector('#toast-container')) document.body.appendChild(toastContainer);

    // Se añade el nuevo toast, al contenedor y se muestra durante un tiempo
    const toastMessage = document.createElement('div')
    toastMessage.classList.add('toast')
    toastMessage.setAttribute('id', 'liveToast')
    toastMessage.setAttribute('role', 'alert')
    toastMessage.setAttribute('aria-live', 'assertive')
    toastMessage.setAttribute('aria-atomic', 'true')
    toastMessage.innerHTML = `
        <div class="toast-header bg-cuaternary-person">
            <strong class="me-auto text-primary-person text-shadow-light-person">${isSuccess ? 'Éxito' : 'Error'}</strong>
            <small class="text-primary-person text-shadow-person">Ahora</small>
            <button type="button" class="btn-close bg-primary-person" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body bg-cuaternary-person text-primary-person text-shadow-person">
            ${message}
        </div>
    `;
    const toastContainerElement = document.querySelector('#toast-container')
    if(toastContainerElement){
        toastContainerElement.appendChild(toastMessage)
        const toast = new bootstrap.Toast(toastMessage);
        toast.show();

        setTimeout(() => {
            toastMessage.remove();
        }, 5000);
    }
};
