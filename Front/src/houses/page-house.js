import * as bootstrap from 'bootstrap'

// Miguel León Fernández
const showHouseModal = async (house) => {
    if (house) {
        document.getElementById("houseModal")?.remove();
        const modalContainer = document.createElement("div");
        modalContainer.innerHTML = `
            <div class="modal fade" id="houseModal" tabindex="-1" aria-labelledby="houseModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-cuaternary-person">
                        <div class="modal-header">
                            <h5 class="modal-title text-primary-person" id="houseModalLabel">¡Casa seleccionada!</h5>
                            <button type="button" class="btn-close bg-primary-person" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center bg-primary-person">
                            <img src="../assets/img/${house}.png" alt="${house}" class="img-fluid rounded img-houses img-house-animation mt-3">
                            <h4 class="text-primary-person mt-4 text-cuaternary-person">Bienvenido a ${house}!</h4>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modalContainer);
        const houseModal = new bootstrap.Modal(document.getElementById("houseModal"));
        houseModal.show();
    }
};

export { showHouseModal }