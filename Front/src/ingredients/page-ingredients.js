import * as bootstrap from "bootstrap";
import {buildHeader, showLogoutButton} from "../components/buildHeader";
import {buildFooter} from "../components/buildFooter";
import {createIngredient, removeIngredient, getIngredients} from "./ingredients-provider";
import {showToastMessages} from "../js/messages";
import {uploadImageS3} from "../student/js/provider-student";

// Miguel León Fernández
const initPageIngredients = async () => {
    buildHeader();
    buildFooter();
    showLogoutButton();
    await buildIngredientFormAccordion();
    await loadIngredients();
};

// Miguel León Fernández
const loadIngredients = async () => {
    const ingredients = await getIngredients();
    const ingredientsContainer = document.getElementById("ingredients-container");
    ingredientsContainer.innerHTML = '';
    ingredients.reverse();

    ingredients.forEach(ingredient => {
        buildCard(ingredient);
    });

    await deleteIngredient();
};

// Miguel León Fernández
const pickImage = (ingredient) => {
    let img;

    if (ingredient.url_photo) {
        img = ingredient.url_photo;
    } else {
        switch (ingredient.name) {
            case 'Aguijón de Lución':
                img = '../assets/img/aguijon_lucion.png';
                break;
            case 'Hígado de drágon':
                img = '../assets/img/higado_dragon.png';
                break;
            case 'Babosa cornuda':
                img = '../assets/img/babosa_cornuda.png';
                break;
            case 'Ojo de tritón':
                img = '../assets/img/ojo_triton.png';
                break;
            default:
                img = '../assets/img/generic_ingredient_1.png';
        }
    }

    return img;
};


// Miguel León Fernández
const buildCard = async (ingredient) => {
    const ingredienteContainer = document.getElementById("ingredients-container");
    const card = document.createElement("div");
    let img = pickImage(ingredient);
    card.className = "col";

    card.innerHTML = `
        <div class="card h-100 rounded-5">
            <div class="card-body rounded-5 d-flex flex-column align-items-center bg-gradient-potions">
                <img class="object-fit-contain mb-3 bg-shadow-potions" src="${img}" alt="img-ingredient" height="200px" width="200px">
                <h4 class="card-title mb-3 text-primary-person">${ingredient.name}</h4>
                <button class="btn btn-primary my-1 w-75 showDetailsIngredientBtn bg-secondary-person">Ver Detalles</button>
                <button class="btn btn-danger my-1 w-75 deleteIngredientBtn bg-hepta-person" data-id="${ingredient.id}">Eliminar</button>
            </div>
        </div>
    `;

    const detailsButton = card.querySelector(".showDetailsIngredientBtn");
    detailsButton.addEventListener("click", () => buildShowDetails(ingredient));
    ingredienteContainer.appendChild(card);
};

// Miguel León Fernández
const buildShowDetails = (ingredient) => {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "ingredientDetailsModal";
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", "ingredientDetailsModalLabel");
    modal.setAttribute("aria-hidden", "true");

    const detailsTable = `
        <table class="table table-bordered m-0">
            <tbody>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Nombre</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.name}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Curación</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.healing}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Envenenamiento</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.poisoning}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Analgésico</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.analgesic}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Dolor</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.pain}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Curativo</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.curative}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Enfermizo</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.sickening}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Inflamatorio</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.inflammatory}</td>
                </tr>
                <tr>
                    <td class="text-primary-person text-center bg-cuaternary-person align-middle"><strong>Desinflamatorio</strong></td>
                    <td class="text-primary-person text-center bg-hepta-person align-middle">${ingredient.deinflammatory}</td>
                </tr>
            </tbody>
        </table>
    `;

    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-xl">
            <div class="modal-content">
                <div class="modal-header bg-cuaternary-person bg-gradient-potions">
                    <h5 class="modal-title text-primary-person" id="ingredientDetailsModalLabel">Detalles del Ingrediente</h5>
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

    const existingModal = document.getElementById("ingredientDetailsModal");
    if (existingModal) existingModal.remove();
    document.body.appendChild(modal);
    const ingredientDetailsModal = new bootstrap.Modal(modal);
    ingredientDetailsModal.show();
};

// Miguel León Fernández
const deleteIngredient = async () => {
    const deleteButtons = document.querySelectorAll('.deleteIngredientBtn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const ingredientId = event.target.dataset.id;
            const success = await removeIngredient(ingredientId);

            if (success) {
                showToastMessages('El ingrediente ha sido eliminado correctamente', true)
                await loadIngredients();
            } else {
                showToastMessages("Error al eliminar el ingrediente. Compruebe que no lo está usando en una poción", false);
            }
            await loadIngredients();
            await buildIngredientFormAccordion();
        });
    });
};

// Miguel León Fernández
const buildIngredientFormAccordion = async () => {
    if (document.getElementById("ingredientFormAccordion")) document.getElementById("ingredientFormAccordion").remove();
    const nav = document.querySelector("#header-container");
    const accordionContainer = document.createElement("div");
    accordionContainer.className = "accordion mt-5 px-3 px-md-5";
    accordionContainer.id = "ingredientFormAccordion";
    accordionContainer.innerHTML = `
        <div class="accordion-item">
            <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button text-primary-person bg-gradient-potions fs-3 fs-md-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapseForm" aria-expanded="true" aria-controls="collapseForm">
                    Creador de Ingredientes
                </button>
            </h2>
            <div id="collapseForm" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#ingredientFormAccordion">
                <div class="accordion-body bg-gradient-creator">
                <p class="text-center fs-4 p-5 text-primary-person bg-ternary-person rounded-3 border border-3">
                    En esta sección podrás crear tus ingredientes, los cuales podrás usar posteriormente para crear tus pociones en el creador de pociones.
                    Para crear tus ingredientes deberás juzgar que <span class="text-hepta-person fw-bold fst-italic">atributos</span> quieres añadirle. Estos atributos
                    haran que tus pociones tengan más <span class="text-hepta-person fw-bold fst-italic">nivel de bondad</span> o tengan más 
                    <span class="text-hepta-person fw-bold fst-italic">nivel de maleza</span>. Tambien pueden tener un valor neutro y que ambos niveles sean iguales.
                    <br><br>¡A que esperas, ponle un <span class="text-hepta-person fw-bold fst-italic">nombre</span> y una <span class="text-hepta-person fw-bold fst-italic">foto</span> 
                    a tu ingrediente y se un alquimista de primera!
                </p>
                    <form id="createIngredientForm" class="px-5 py-3">
                        <div class="mb-4">
                            <label for="ingredientName" class="form-label text-primary-person fs-2">Nombre del Ingrediente</label>
                            <input type="text" class="form-control bg-hexa-person text-primary-person w-100 fs-4" placeholder="Ej: Mandrágora..." id="ingredientName" minlength="5" maxlength="60" required>
                        </div>

                        <div class="row g-3">
                            <div class="col-md-6">
                                <label for="healing" class="form-label text-primary-person fs-4">Sanación (0-100)</label>
                                <input type="number" id="healing" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="poisoning" class="form-label text-primary-person fs-4">Envenenamiento (0-100)</label>
                                <input type="number" id="poisoning" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="analgesic" class="form-label text-primary-person fs-4">Analgésico (0-100)</label>
                                <input type="number" id="analgesic" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="pain" class="form-label text-primary-person fs-4">Doloroso (0-100)</label>
                                <input type="number" id="pain" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="curative" class="form-label text-primary-person fs-4">Curativo (0-100)</label>
                                <input type="number" id="curative" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="sickening" class="form-label text-primary-person fs-4">Enfermante (0-100)</label>
                                <input type="number" id="sickening" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="inflammatory" class="form-label text-primary-person fs-4">Inflamatorio (0-100)</label>
                                <input type="number" id="inflammatory" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                            <div class="col-md-6">
                                <label for="deinflammatory" class="form-label text-primary-person fs-4">Desinflamatorio (0-100)</label>
                                <input type="number" id="deinflammatory" class="form-control bg-hexa-person text-primary-person fs-4" min="0" max="100" value="0" required>
                            </div>
                        </div>

                        <div class="mb-4 mt-3">
                            <label for="image" class="form-label text-primary-person fs-4">Foto del Ingrediente</label>
                            <input type="file" id="image" class="form-control bg-hexa-person text-primary-person fs-4">
                        </div>

                        <div class="d-flex justify-content-center">
                            <button type="submit" class="btn bg-ternary-person fs-4 w-100 w-sm-50 w-md-25 py-3">Crear Ingrediente</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    nav.insertAdjacentElement("afterend", accordionContainer);
    document.getElementById("createIngredientForm").addEventListener("submit", handleCreateIngredient);
};

// Miguel León Fernández
const handleCreateIngredient = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("name", document.getElementById("ingredientName").value);
    formData.append("healing", document.getElementById("healing").value);
    formData.append("poisoning", document.getElementById("poisoning").value);
    formData.append("analgesic", document.getElementById("analgesic").value);
    formData.append("pain", document.getElementById("pain").value);
    formData.append("curative", document.getElementById("curative").value);
    formData.append("sickening", document.getElementById("sickening").value);
    formData.append("inflammatory", document.getElementById("inflammatory").value);
    formData.append("deinflammatory", document.getElementById("deinflammatory").value);

    const file = document.getElementById("image").files[0];
    let imageUrl = '';
    if (file) {
        console.log("archivo selecionado",file)
        try {
            const uploadedImage = await  uploadImageS3(file)

            if (uploadedImage && uploadedImage.url) {
                imageUrl = uploadedImage.url
                formData.append("imageUrl", imageUrl.url);
            } else {
                showToastMessages("Error al subir la imagen.", false);
                return;
            }
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            showToastMessages("Error al subir la imagen.", false);
            return;
        }
    }

    try {
        const newIngredient = await createIngredient(formData);

        if (newIngredient) {
            showToastMessages("Ingrediente creado con éxito:", true);
            event.target.reset();
        } else {
            showToastMessages("Hubo un problema al crear el ingrediente.", false);
        }
    } catch (error) {
        console.error("Error al crear el ingrediente:", error);
        showToastMessages("Error al crear el ingrediente.", false);
    }

    await loadIngredients();
    await buildIngredientFormAccordion();
};


await initPageIngredients();