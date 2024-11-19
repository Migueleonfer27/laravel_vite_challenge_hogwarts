import * as bootstrap from 'bootstrap';
import { buildHeader, showLogoutButton } from "../components/buildHeader";
import { buildFooter } from "../components/buildFooter";
import { getPotions, removePotion, updatePotion, createPotion } from "./potions-provider";
import { getIngredients } from "../ingredients/ingredients-provider";
import { showToastMessages } from "../js/messages";

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

    await deletePotion();
};

// Miguel León Fernández
const pickImage = (potion) => {
    let img;
    const goodLevel = potion.good_level;
    const badLevel = potion.bad_level;

    switch (true) {
        case goodLevel === 0 && badLevel !== 0 :
            img = '../assets/img/potion_5.png';
            break;
        case badLevel === 0 && goodLevel !== 0 :
            img = '../assets/img/potion_1.png';
            break;
        case goodLevel > badLevel:
            img = '../assets/img/potion_2.png';
            break;
        case badLevel > goodLevel:
            img = '../assets/img/potion_4.png';
            break;
        default:
            img = '../assets/img/potion_3.png';
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
                <img class="object-fit-contain mb-3 bg-shadow-potions" src="${url}" alt="img-ingredient" height="200px" width="200px">
                <h4 class="card-title mb-3 text-primary-person">${potion.name}</h4>
                <button class="btn btn-primary my-1 w-75 showDetailsPotionBtn bg-secondary-person">Ver Detalles</button>
                <button class="btn btn-secondary my-1 w-75 showModifyPotionBtn bg-ternary-person" data-id="${potion.id}">Modificar</button>
                <button class="btn btn-danger my-1 w-75 deletePotionBtn bg-hepta-person" data-id="${potion.id}">Eliminar</button>
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
                <button type="button" class="btn bg-ternary-person w-100 toggle-ingredient-btn" data-id="${ingredient.id}">
                    <span class="text-primary-person">Añadir</span>
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
            <div id="collapseForm" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#potionFormAccordion">
                <div class="accordion-body bg-gradient-creator">
                    <form id="createPotionForm" class="px-5 py-3">
                        <div class="mb-4 d-flex flex-column justify-content-center">
                            <p class="text-center fs-4 p-5 text-primary-person bg-ternary-person rounded-3 border border-3">
                                En esta sección podrás crear tus pócimas, las cuales serán aprobadas por tu profesor y posteriormente por el flamante y afable director Dumbledore.
                                Para crear tus pócimas deberás ponerle un <span class="text-hepta-person fw-bold fst-italic">nombre</span> 
                                obligatoriamente, una <span class="text-hepta-person fw-bold fst-italic">descripción</span> de la poción y añadir alguno de los 
                                <span class="text-hepta-person fw-bold fst-italic">ingredientes</span> que verás en la lista de ingredientes.
                                Pulsa el botón para añadir y vuelve a pulsar para quitarlo si así lo deseas. <br><br>!No te demores en hacer pociones!, tus profesores y Dumbledore esperan
                                tus resultados para que puedas <span class="text-hepta-person fw-bold fst-italic">progresar de nivel</span> y <span class="text-hepta-person fw-bold fst-italic">añadir puntos a tu casa</span>.
                            </p>
                            <label for="potionName" class="form-label text-primary-person fs-2 fs-md-2">Nombre de la Poción</label>
                            <input type="text" class="form-control bg-hexa-person text-cuaternary-person w-100 w-md-75 fs-4" placeholder="Ej: poción de velocidad..." id="potionName" minlength="5" maxlength="40" required>
                            <label for="potionDescription" class="form-label text-primary-person fs-2 fs-md-2 mt-3">Descripción de la Poción</label>
                            <textarea id="potionDescription" class="form-control textarea bg-hexa-person text-cuaternary-person w-100 w-md-75 fs-4" placeholder="Ej: Esta poción aumenta la velociad de la persona..." cols="30" rows="3" minlength="1" maxlength="255" required></textarea>
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
                            <button type="submit" class="btn bg-ternary-person fs-4 w-100 w-sm-50 w-md-25 py-3">Crear Poción</button>
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
        const potionDescription = document.getElementById("potionDescription").value;
        const selectedIngredientArray = Array.from(selectedIngredients);
        const success = await createPotion(potionName, potionDescription, selectedIngredientArray);

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
        button.classList.remove("bg-secondary-person");
        button.classList.add("bg-ternary-person");
    } else {
        selectedIngredients.add(ingredientId);
        button.textContent = "Quitar";
        button.classList.remove("bg-ternary-person");
        button.classList.add("bg-secondary-person");
    }
};

// Miguel León Fernández
const resetIngredientSelection = (selectedIngredients) => {
    selectedIngredients.clear();
    const buttons = document.querySelectorAll(".toggle-ingredient-btn");
    buttons.forEach(button => {
        button.textContent = "Añadir";
        button.classList.remove("bg-secondary-person");
        button.classList.add("bg-ternary-person");
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
    const approve_teacher = potion.approves_teacher === 0 ? 'Pendiente' : 'Aprobada';
    const approve_dumbledore = potion.approves_dumbledore === 0 ? 'Pendiente' : 'Aprobada';
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
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Descripción</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${potion.description}</td>
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
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Aprobación Profesor</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${approve_teacher}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Aprobación Dubledore</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${approve_dumbledore}</td>
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
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-cuaternary-person bg-gradient-potions">
                    <h5 class="modal-title text-primary-person" id="potionDetailsModalLabel">Detalles de la Poción</h5>
                    <button type="button" class="btn-close bg-primary-person" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body bg-primary-person">
                    ${detailsTable}
                </div>
                <div class="modal-footer bg-cuaternary-person bg-gradient-potions">
                    <button type="button" class="btn bg-secondary-person" data-bs-dismiss="modal">Cerrar</button>
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
                <div class="modal-header bg-gradient-potions">
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
                            <div class="col-12">
                                <h5 class="text-cuaternary-person mt-3">Descripción de la Poción</h5>
                                <textarea id="potion-description" class="form-control textarea bg-cuaternary-person text-primary-person w-100 w-md-75 fs-5" cols="30" rows="3" minlength="1" maxlength="255">${potion.description}</textarea>
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
                <div class="modal-footer bg-gradient-potions">
                    <button type="button" class="btn bg-secondary-person" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn bg-cuaternary-person" id="saveChanges">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    await refreshIngredientsTable(currentIngredients, allIngredients);
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
    const newDescripcion = document.getElementById("potion-description").value;
    const success = await updatePotion(potion.id, newPotionName, newDescripcion, currentIngredients.map(ing => ing.id));

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

    const alertType = success ? 'bg-ternary-person' : 'bg-hepta-person';
    const alertMessage = document.createElement("div");
    alertMessage.classList.add('alert', 'text-center', 'd-flex', 'justify-content-center', 'mx-auto', 'w-75', 'text-primary-person', alertType);
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
            <td class="align-middle bg-cuaternary-person text-primary-person"><button class="btn bg-primary-person btn-sm w-100" data-index="${index}"><span class="text-cuaternary-person">Eliminar</span></button></td>
        </tr>
    `).join("");

    availableIngredientsTable.innerHTML = allIngredients.filter(ingredient =>
        !currentIngredients.some(curr => curr.id === ingredient.id)
    ).map(ingredient => `
        <tr>
            <td class="align-middle bg-cuaternary-person text-primary-person text-center">${ingredient.name}</td>
            <td class="align-middle bg-cuaternary-person text-primary-person"><button class="btn bg-secondary-person btn-sm w-100" data-id="${ingredient.id}"><span class="text-cuaternary-person">Añadir</span></button></td>
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
const deletePotion = async () => {
    const deleteButtons = document.querySelectorAll('.deletePotionBtn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const potionId = event.target.dataset.id;
            const success = await removePotion(potionId);

            if (success) {
                showToastMessages('La poción ha sido eliminada correctamente', true)
                await loadPotions();
            } else {
                showToastMessages("Error al eliminar la poción", false);
            }
            await buildPotionFormAccordion();
        });
    });
};

await initPagePotions();
