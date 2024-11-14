import * as bootstrap from 'bootstrap'
import { buildHeader, showLogoutButton } from "../components/buildHeader";
import { buildFooter } from "../components/buildFooter";
import { getPotions } from "../potions/potions-provider";

const initPagePotions = async () => {
    buildHeader();
    buildFooter();
    showLogoutButton();
    await loadPotions();
}

const loadPotions = async () => {
    const potions = await getPotions();

    potions.forEach(potion => {
        buildCard(potion);
    });
}

const buildCard = (potion) => {
    const potionsContainer = document.getElementById("potions-container");

    const card = document.createElement("div");
    card.className = "col";

    card.innerHTML = `
        <div class="card h-100 rounded-5">
            <div class="card-body rounded-5 d-flex flex-column align-items-center bg-secondary-person">
                <img class="img-fluid mb-3 img-houses" src="https://genesistoxical.com/wp-content/uploads/2021/05/Pocion_animada_png.png" alt="img-potion" height="200px" width="200px">
                <h4 class="card-title mb-3">${potion.name}</h4>
                <button id="showDetailsPotionBtn" class="btn btn-primary my-1 w-75">Ver Detalles</button>
                <button id="modifyPotionBtn" class="btn btn-secondary my-1 w-75">Modificar</button>
                <button id="deletePotionBtn" class="btn btn-danger my-1 w-75">Eliminar</button>
            </div>
        </div>
    `;

    const detailsButton = card.querySelector(".btn-primary");
    detailsButton.addEventListener("click", () => buildShowDetails(potion));
    potionsContainer.appendChild(card);
}

const buildShowDetails = (potion) => {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "potionDetailsModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", "potionDetailsModalLabel");
    modal.setAttribute("aria-hidden", "true");
    const approve = potion.approves === 0 ? 'Pendiente' : 'Aprobada';
    const ingredientsList = potion.ingredients.map(ingredient => ingredient.name).join(', ');

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-cuaternary-person">
                    <h5 class="modal-title text-primary-person" id="potionDetailsModalLabel">Detalles de la Poción</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-primary-person">
                    <p class="text-cuaternary-person"><strong>Nombre:</strong> ${potion.name}</p>
                    <p class="text-cuaternary-person"><strong>Elaborada por:</strong> ${potion.user.name}</p>
                    <p class="text-cuaternary-person"><strong>Nivel de bondad:</strong> ${potion.good_level}</p>
                    <p class="text-cuaternary-person"><strong>Nivel de maleza:</strong> ${potion.bad_level}</p>
                    <p class="text-cuaternary-person"><strong>Aprobación:</strong> ${approve}</p>
                    <p class="text-cuaternary-person"><strong>Ingredientes:</strong> ${ingredientsList}</p>
                </div>
                <div class="modal-footer bg-cuaternary-person">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById("potionDetailsModal");

    if (existingModal) {
        existingModal.remove();
    }

    document.body.appendChild(modal);
    const potionDetailsModal = new bootstrap.Modal(modal);
    potionDetailsModal.show();
}

initPagePotions();