import * as bootstrap from 'bootstrap';
import { buildHeader, showLogoutButton } from "../components/buildHeader";
import { buildFooter } from "../components/buildFooter";
import { getPotions, removePotion, updatePotion, createPotion } from "../potions/potions-provider";
import { getIngredients } from "../ingredients/ingredients-provider";

// Miguel León Fernández
const initPagePotions = async () => {
    buildHeader();
    buildFooter();
    showLogoutButton();
    await buildPotionFormAccordion();
    await loadPotions();
};

// Miguel León Fernández
const loadPotions = async () => {
    const potions = await getPotions();
    const potionsContainer = document.getElementById("potions-container");
    potionsContainer.innerHTML = '';
    potions.reverse();

    potions.forEach(potion => {
        buildCard(potion);
    });

    deletePotion();
};

// Miguel León Fernández
const pickImage = (potion) => {
    let img = '';
    const goodLevel = potion.good_level;
    const badLevel = potion.bad_level;

    switch (true) {
        case badLevel === 0:
            img = '../assets/img/potion_1.png';
            break;
        case goodLevel === 0:
            img = '../assets/img/potion_5.png';
            break;
        case goodLevel - badLevel >= 40:
            img = '../assets/img/potion_2.png';
            break;
        case goodLevel - badLevel >= 20:
            img = '../assets/img/potion_3.png';
            break;
        default:
            img = '../assets/img/potion_4.png';
            break;
    }

    return img;
}

// Miguel León Fernández
const buildCard = async (potion) => {
    const potionsContainer = document.getElementById("potions-container");
    const card = document.createElement("div");
    card.className = "col";
    const url = pickImage(potion);

    card.innerHTML = `
        <div class="card h-100 rounded-5">
            <div class="card-body rounded-5 d-flex flex-column align-items-center bg-gradient-potions">
                <img class="img-fluid mb-3 bg-shadow-potions" src="${url}" alt="img-potion" height="200px" width="200px">
                <h4 class="card-title mb-3 text-primary-person">${potion.name}</h4>
                <button class="btn btn-primary my-1 w-75 showDetailsPotionBtn">Ver Detalles</button>
                <button class="btn btn-secondary my-1 w-75 showModifyPotionBtn" data-id="${potion.id}">Modificar</button>
                <button class="btn btn-danger my-1 w-75 deletePotionBtn" data-id="${potion.id}">Eliminar</button>
            </div>
        </div>
    `;

    const detailsButton = card.querySelector(".showDetailsPotionBtn");
    detailsButton.addEventListener("click", () => buildShowDetails(potion));
    const modifyPotionButton = card.querySelector(".showModifyPotionBtn");
    modifyPotionButton.addEventListener("click", () => buildModifyPotion(potion));
    potionsContainer.appendChild(card);
};

// Miguel León Fernández
const buildPotionFormAccordion = async () => {
    if (document.getElementById("potionFormAccordion")) document.getElementById("potionFormAccordion").remove();
    const nav = document.querySelector("#header-container");
    const accordionContainer = document.createElement("div");
    accordionContainer.className = "accordion mt-5 px-3 px-md-5";
    accordionContainer.id = "potionFormAccordion";
    const ingredients = await getIngredients();
    const selectedIngredients = new Set();

    const ingredientRows = ingredients.map(ingredient => `
        <tr>
            <td class="text-primary-person bg-hepta-person fs-5">${ingredient.name}</td>
            <td class="text-primary-person bg-hepta-person fs-5">
                <button type="button" class="btn btn-success w-100 toggle-ingredient-btn" data-id="${ingredient.id}">
                    Añadir
                </button>
            </td>
        </tr>
    `).join('');

    accordionContainer.innerHTML = `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button text-primary-person bg-gradient-potions fs-3 fs-md-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm" aria-expanded="true" aria-controls="collapseForm">
                    Creador de Pócimas
                </button>
            </h2>
            <div id="collapseForm" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#potionFormAccordion">
                <div class="accordion-body bg-primary-person">
                    <form id="createPotionForm">
                        <div class="mb-4 d-flex flex-column justify-content-center">
                            <label for="potionName" class="form-label text-cuaternary-person fs-4 fs-md-2">Nombre de la Poción</label>
                            <input type="text" class="form-control bg-secondary-person text-cuaternary-person w-100 w-md-75 fs-4" placeholder="Ej: poción de velocidad..." id="potionName" minlength="5" maxlength="40" required>
                        </div>

                        <div class="mb-3">
                            <table class="table table-responsive table-bordered">
                                <thead>
                                    <tr>
                                        <th class="text-center bg-cuaternary-person text-primary-person fs-4">Ingrediente</th>
                                        <th class="text-center bg-cuaternary-person text-primary-person fs-4">Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="ingredients-table" class="text-center align-middle">
                                    ${ingredientRows}
                                </tbody>
                            </table>
                        </div>

                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn bg-secondary fs-4 w-100 w-sm-50 w-md-25 py-3">Crear Poción</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    nav.appendChild(accordionContainer);
    initIngredientTableEvents(selectedIngredients);
    const potionForm = document.getElementById("createPotionForm");

    potionForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const potionName = document.getElementById("potionName").value;
        const selectedIngredientArray = Array.from(selectedIngredients);
        const success = await createPotion(potionName, selectedIngredientArray);

        if (success) {
            showToastMessages("Poción creada con éxito", true);
            potionForm.reset();
            resetIngredientSelection(selectedIngredients);
            await loadPotions();
        } else {
            showToastMessages("Error al crear la poción", false);
        }
        await buildPotionFormAccordion();
    });
};

// Miguel León Fernández
const initIngredientTableEvents = (selectedIngredients) => {
    const table = document.getElementById("ingredients-table");

    table.addEventListener("click", (event) => {
        if (event.target.classList.contains("toggle-ingredient-btn")) {
            toggleIngredientSelection(event.target, selectedIngredients);
        }
    });
};

// Miguel León Fernández
const toggleIngredientSelection = (button, selectedIngredients) => {
    const ingredientId = parseInt(button.dataset.id, 10);
    if (selectedIngredients.has(ingredientId)) {
        selectedIngredients.delete(ingredientId);
        button.textContent = "Añadir";
        button.classList.remove("btn-danger");
        button.classList.add("btn-success");
    } else {
        selectedIngredients.add(ingredientId);
        button.textContent = "Quitar";
        button.classList.remove("btn-success");
        button.classList.add("btn-danger");
    }
};

// Miguel León Fernández
const resetIngredientSelection = (selectedIngredients) => {
    selectedIngredients.clear();
    const buttons = document.querySelectorAll(".toggle-ingredient-btn");
    buttons.forEach(button => {
        button.textContent = "Añadir";
        button.classList.remove("btn-secondary");
        button.classList.add("btn-outline-secondary");
    });
};

// Miguel León Fernández
const buildShowDetails = (potion) => {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "potionDetailsModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", "potionDetailsModalLabel");
    modal.setAttribute("aria-hidden", "true");
    const approve = potion.approves === 0 ? 'Pendiente' : 'Aprobada';
    const ingredientsRows = potion.ingredients.map(ingredient => {
        return `<tr><td class="text-primary-person text-center bg-hepta-person">${ingredient.name}</td></tr>`;
    }).join('');

    const detailsTable = `
        <table class="table table-bordered m-0">
            <tbody>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Nombre</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${potion.name}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Creador</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${potion.user.name}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Nivel de bondad</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${potion.good_level}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Nivel de maleza</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${potion.bad_level}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Aprobación</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${approve}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Ingredientes</strong></td>
                    <td class="text-cuaternary-person bg-cuaternary-person">
                        <table class="table table-bordered m-0">
                            <tbody>
                                ${ingredientsRows}
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    `;

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-cuaternary-person">
                    <h5 class="modal-title text-primary-person" id="potionDetailsModalLabel">Detalles de la Poción</h5>
                    <button type="button" class="btn-close bg-primary-person" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-primary-person">
                    ${detailsTable}
                </div>
                <div class="modal-footer bg-cuaternary-person">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    const existingModal = document.getElementById("potionDetailsModal");
    if (existingModal) existingModal.remove();
    document.body.appendChild(modal);
    const potionDetailsModal = new bootstrap.Modal(modal);
    potionDetailsModal.show();
};

// Miguel León Fernández
let isModalOpen = false;

const buildModifyPotion = async (potion) => {
    if (isModalOpen) return;
    isModalOpen = true;
    const existingModal = document.getElementById("modifyPotionModal");
    if (existingModal) existingModal.remove();
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "modifyPotionModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", "modifyPotionModalLabel");
    modal.setAttribute("aria-hidden", "true");
    let currentIngredients = [...potion.ingredients];
    const allIngredients = await getIngredients();

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-cuaternary-person">
                    <h5 class="modal-title text-primary-person">Modificar Poción</h5>
                    <button type="button" class="btn-close bg-primary-person" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body bg-primary-person">
                    <div class="container">
                        <div class="row mb-3">
                            <div class="col-12">
                                <h5 class="text-cuaternary-person">Nombre de la Poción</h5>
                                <input type="text" id="potion-name" class="form-control bg-cuaternary-person text-primary-person" value="${potion.name}" />
                            </div>
                            <div class="col-12 col-md-6 mt-3">
                                <h5 class="text-cuaternary-person">Ingredientes actuales</h5>
                                <div class="table-responsive">
                                    <table class="table" id="current-ingredients-table"></table>
                                </div>
                            </div>
                            <div class="col-12 col-md-6 mt-3">
                                <h5 class="text-cuaternary-person">Ingredientes disponibles</h5>
                                <div class="table-responsive">
                                    <table class="table" id="available-ingredients-table"></table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer bg-cuaternary-person">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="saveChanges">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    refreshIngredientsTable(currentIngredients, allIngredients);
    document.getElementById("saveChanges").addEventListener("click", () => saveChanges(potion, currentIngredients));
    const modifyPotionModal = new bootstrap.Modal(modal);

    modal.addEventListener("hidden.bs.modal", () => {
        isModalOpen = false;
        modal.remove();
    });

    modifyPotionModal.show();
};

// Miguel León Fernández
const saveChanges = async (potion, currentIngredients) => {
    const newPotionName = document.getElementById("potion-name").value;
    const success = await updatePotion(potion.id, newPotionName, currentIngredients.map(ing => ing.id));

    if (success) {
        showMessagesAlerts("Poción actualizada con éxito", true);
        await loadPotions();
    } else {
        showMessagesAlerts("Error al actualizar la poción", false);
    }
};

// Miguel León Fernández
const showMessagesAlerts = (message, success) => {
    const modalBody = document.querySelector("#modifyPotionModal .modal-body");
    const existingAlert = modalBody.querySelector(".alert");
    if (existingAlert) existingAlert.remove();

    const alertType = success ? 'alert-success' : 'alert-danger';
    const alertMessage = document.createElement("div");
    alertMessage.classList.add('alert', 'text-center', 'd-flex', 'justify-content-center', 'mx-auto', 'w-75', alertType);
    alertMessage.role = "alert";
    alertMessage.innerHTML = message;
    modalBody.appendChild(alertMessage);

    setTimeout(() => {
        alertMessage.remove();
    }, 5000);
};

// Miguel León Fernández
const refreshIngredientsTable = (currentIngredients, allIngredients) => {
    const currentIngredientsTable = document.getElementById("current-ingredients-table");
    const availableIngredientsTable = document.getElementById("available-ingredients-table");

    currentIngredientsTable.innerHTML = currentIngredients.map((ingredient, index) => `
        <tr>
            <td class="align-middle bg-cuaternary-person text-primary-person text-center">${ingredient.name}</td>
            <td class="align-middle bg-cuaternary-person text-primary-person"><button class="btn btn-danger btn-sm w-100" data-index="${index}">Eliminar</button></td>
        </tr>
    `).join("");

    availableIngredientsTable.innerHTML = allIngredients.filter(ingredient =>
        !currentIngredients.some(curr => curr.id === ingredient.id)
    ).map(ingredient => `
        <tr>
            <td class="align-middle bg-cuaternary-person text-primary-person text-center">${ingredient.name}</td>
            <td class="align-middle bg-cuaternary-person text-primary-person"><button class="btn btn-success btn-sm w-100" data-id="${ingredient.id}">Añadir</button></td>
        </tr>
    `).join("");

    currentIngredientsTable.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index, 10);
            removeIngredient(index, currentIngredients, allIngredients);
        });
    });

    availableIngredientsTable.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            const ingredientId = parseInt(button.dataset.id, 10);
            addIngredient(ingredientId, currentIngredients, allIngredients);
        });
    });
};

// Miguel León Fernández
const addIngredient = (ingredientId, currentIngredients, allIngredients) => {
    const ingredient = allIngredients.find(ing => ing.id === ingredientId);
    if (ingredient) {
        currentIngredients.push(ingredient);
        refreshIngredientsTable(currentIngredients, allIngredients);
    }
};

// Miguel León Fernández
const removeIngredient = (index, currentIngredients, allIngredients) => {
    currentIngredients.splice(index, 1);
    refreshIngredientsTable(currentIngredients, allIngredients);
};

// Miguel León Fernández
const deletePotion = () => {
    const deleteButtons = document.querySelectorAll('.deletePotionBtn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const potionId = event.target.dataset.id;
            const success = await removePotion(potionId);

            if (success) {
                showToastMessages('La poción ha sido eliminada correctamente')
                await loadPotions();
            } else {
                showToastMessages("Error al eliminar la poción");
            }
        });
    });
};

// Miguel León Fernández
const showToastMessages = (message, isSuccess = true) => {
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

initPagePotions();
