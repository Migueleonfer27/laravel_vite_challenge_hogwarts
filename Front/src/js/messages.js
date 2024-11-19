import * as bootstrap from 'bootstrap';

// Miguel León Fernández
export const showToastMessages = (message, isSuccess) => {
    const toastMessage = `
        <div class="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-cuaternary-person">
                    <strong class="me-auto text-primary-person">${isSuccess ? 'Éxito' : 'Error'}</strong>
                    <small class="text-primary-person">Ahora</small>
                    <button type="button" class="btn-close bg-primary-person" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-cuaternary-person text-primary-person">
                    ${message}
                </div>
            </div>
        </div>
    `;

    if (!document.querySelector('#liveToast')) document.body.innerHTML += toastMessage;
    const toastElement = document.querySelector('#liveToast');
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    setTimeout(() => {
        toastElement.remove();
    }, 5000);
};
