
import '../../scss/styles.scss';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {removeToken} from "../../../storage/tokenManager";
import { getAllSpells, getStudentSpells, getSpellLearned, createSpell, deleteSpell, updateSpell, learnSpell,
    getSpellpendings, approveSpellTeacher, rejectSpellTeacher, getPendingDumbledore,
    approveSpellDumbledore, rejectSpellDumbledore, addExperience } from "./spell-provider";
import { Spell } from "./Spell";
import * as validation from "./validation";
import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";
import {handleLogout} from "../../auth/auth-provider";

//Monica
let rolesUser = localStorage.getItem('roles')
let roles = rolesUser.split(',')

let spellData = []
//Monica
if (roles.includes('teacher') || roles.includes('dumbledore')){
    spellData = await getAllSpells()
    console.log(spellData)
}else {
    spellData = await getStudentSpells()
    if (localStorage.getItem('level') < 2) document.querySelector('#spellAccordion').style.display = 'none'
}
//Monica
let spellArray = []
let createSpells =  () => {
    const spells = spellData.spell

    spells.forEach(spell => {
        if (spell.creator === null) {
            spell.creator = 'Desconocido'
        }
        const newSpell = new Spell(
            spell.id,
            spell.name,
            spell.level,
            spell.attack,
            spell.defense,
            spell.damage,
            spell.healing,
            spell.summon,
            spell.action,
            spell.validation_status,
            spell.created_at,
            spell.updated_at,
            spell.creator
        )
        spellArray.push(newSpell)
    })
}

const inputHasCreator = document.getElementById('spell-creator');
let hasCreator = true;
inputHasCreator.addEventListener('change', () => {
    hasCreator = inputHasCreator.checked;
    const levelInput = document.getElementById('spell-level');
    levelInput.disabled = hasCreator; // Usar .disabled en lugar de setAttribute
    console.log(levelInput.disabled);
});


//Monica
const selectImage = (spell) => {

    let img = '';
    const maxCharacteristic = Math.max(spell.attack, spell.defense, spell.damage, spell.healing, spell.summon, spell.action);

    if (maxCharacteristic === spell.attack) {
        img = '../../../assets/img/spell-attack.png';
    } else if (maxCharacteristic === spell.defense) {
        img = '../../../assets/img/spell-defense.png';
    } else if (maxCharacteristic === spell.damage) {
        img = '../../../assets/img/spell-damage.png';
    } else if (maxCharacteristic === spell.healing) {
        img = '../../../assets/img/spell-healing.png';
    } else if (maxCharacteristic === spell.summon) {
        img = '../../../assets/img/spell-summon.png';
    } else if (maxCharacteristic === spell.action) {
        img = '../../../assets/img/spell-action.png';
    }

    return img;
};
//Monica
const buildSpellCards = async (spellArray) => {
    const spellContainer = document.querySelector('#spell_cards');

    for (const spell of spellArray) {
        const img = selectImage(spell);

        const card = document.createElement('div');
        card.classList.add('card', 'rounded-5', 'not-learned-spell');
        card.innerHTML = `
            <div class="card-body rounded-5 d-flex flex-column align-items-center bg-gradient-spell p-4">
                <img id="spell-img" class="card-img-top bg-shadow-spell object-fit-contain" src="${img}" alt="Spell Image" height="100%" width="100%">
                <h5 class="card-title mb-3 text-primary-person text-shadow-person text-center fs-3">${spell.name}</h5>
                <p class="card-text text-shadow-person text-primary-person text-center fs-5">Creador: ${spell.creator}</p>
                <div class="btn-group align-content-stretch d-flex justify-content-center flex-column">
                    <button class="btn my-1 bg-secondary-person text-primary-person text-shadow-person rounded-2 fs-5 px-5">Más detalles</button>
                </div>
            </div>
        `;
        const buttonGroup = card.querySelector('.btn-group');

        if (roles.includes('teacher')){
           if(spell.validation_status !== 'pending'){
               console.log(spell.creator, spell.creator === 'Desconocido' && spell.creator === localStorage.getItem('name'))
              if(spell.creator !== 'Desconocido'  && spell.creator === localStorage.getItem('name')){
                  const modifyButton = document.createElement('button');
                  modifyButton.classList.add('btn', 'btn-modificar', 'bg-ternary-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-1', 'fs-5', 'px-5');
                  modifyButton.textContent = 'Modificar';

                  modifyButton.addEventListener('click', () => {
                      openEditSpellModal(spell);
                  });
                  buttonGroup.appendChild(modifyButton);

                  const deleteButton = document.createElement('button');
                  deleteButton.classList.add('btn', 'btn-eliminar', 'bg-hepta-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-2', 'fs-5', 'px-5');
                  deleteButton.textContent = 'Eliminar';
                  deleteButton.addEventListener('click', async () => {
                      await deleteSpell(spell.id);
                      card.remove();
                  });
                  buttonGroup.appendChild(deleteButton);

              }
           }else {

                   const approveButton = document.createElement('button');
                   approveButton.classList.add('btn', 'btn-approve');
                   approveButton.textContent = 'Aprobar';

                   approveButton.addEventListener('click', async () => {
                       let data = await approveSpellTeacher(spell.id);
                       if (data.success) {
                            window.location.reload()
                       }
                   })

                   buttonGroup.appendChild(approveButton);

                   const rejectButton = document.createElement('button');
                   rejectButton.classList.add('btn', 'btn-eliminar', 'bg-hepta-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-2', 'fs-5', 'px-5');
                   rejectButton.textContent = 'Rechazar';

                   rejectButton.addEventListener('click', async () => {
                       let data = await rejectSpellTeacher(spell.id);
                       if (data.success) location.reload()
                   })

                   buttonGroup.appendChild(rejectButton);
           }
        }else if (roles.includes('student')){

            const learnButton = document.createElement('button');
            learnButton.classList.add('btn', 'btn-learn', 'text-primary-person', 'text-shadow-person', 'text-center', 'mt-2', 'fs-5', 'px-5', 'bg-hepta-person', 'rounded-2');
            learnButton.textContent = 'Aprender';

            learnButton.addEventListener('click', async () => {
                // console.log('Aprender');
                try {
                        const result = await learnSpell(spell.id);
                    if (result.success) {
                        console.log(`Hechizo "${spell.name}" aprendido con éxito.`);
                        location.reload()
                    } else {
                        console.log(`No se pudo aprender el hechizo: ${result.message}`);
                    }
                } catch (error) {
                    console.log('Ocurrió un error al intentar aprender el hechizo. Intenta de nuevo.');
                }
            })

            buttonGroup.appendChild(learnButton);
        }else if (roles.includes('dumbledore')){
            if(spell.validation_status === 'approved by teacher'){
                const approveButton = document.createElement('button');
                approveButton.classList.add('btn', 'btn-modificar', 'bg-ternary-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-1', 'fs-5', 'px-5');
                approveButton.textContent = 'Aprobar';

                approveButton.addEventListener('click', async () => {
                    let data = await approveSpellDumbledore(spell.id);
                    if (data.success) {
                        let dataExperience = await addExperience(spell.id)
                        if (dataExperience.success) location.reload()
                    }
                })

                buttonGroup.appendChild(approveButton);

                const rejectButton = document.createElement('button');
                rejectButton.classList.add('btn', 'btn-eliminar', 'bg-hepta-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-2', 'fs-5', 'px-5');
                rejectButton.textContent = 'Rechazar';

                rejectButton.addEventListener('click', async () => {
                    let data = await rejectSpellDumbledore(spell.id);
                    if (data.success) location.reload()
                })

                buttonGroup.appendChild(rejectButton);
            }else {
                if(spell.creator !== 'Desconocido'  && spell.creator === localStorage.getItem('name')){
                    const modifyButton = document.createElement('button');
                    modifyButton.classList.add('btn', 'btn-modificar', 'bg-ternary-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-1', 'fs-5', 'px-5');
                    modifyButton.textContent = 'Modificar';

                    modifyButton.addEventListener('click', () => {
                        openEditSpellModal(spell);
                    });
                    buttonGroup.appendChild(modifyButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.classList.add('btn', 'btn-eliminar', 'bg-hepta-person', 'rounded-2', 'text-primary-person', 'text-shadow-person', 'mt-2', 'fs-5', 'px-5');
                    deleteButton.textContent = 'Eliminar';
                    deleteButton.addEventListener('click', async () => {
                        await deleteSpell(spell.id);
                        card.remove();
                    });
                    buttonGroup.appendChild(deleteButton);

                }
            }
        }


        const button = card.querySelector('.btn');
        button.addEventListener('click', () => {
            openSpellDetails(spell);
        });

        spellContainer.appendChild(card);
    }
    hideLoader(null, 600)
};

//Monica
const buttonShowPending = document.getElementById('teacher-btn');
if (!roles.includes('teacher')) buttonShowPending.style.display = 'none';

let showingTeacher = true;

buttonShowPending.addEventListener('click', async () => {

    const cardsCreated = document.querySelectorAll('.card')
    console.log(cardsCreated)
    cardsCreated.forEach(card => {
        card.remove()
    })
    let newSpellData = await getSpellpendings()
    let spellArray = []
    if(showingTeacher){
        const newSpells = newSpellData.spell

        newSpells.forEach(spell => {
            if (spell.creator === null) {
                spell.creator = 'Desconocido'
            }
            const newSpell = new Spell(
                spell.id,
                spell.name,
                spell.level,
                spell.attack,
                spell.defense,
                spell.damage,
                spell.healing,
                spell.summon,
                spell.action,
                spell.validation_status,
                spell.created_at,
                spell.updated_at,
                spell.creator
            )
            spellArray.push(newSpell)
        })

        buttonShowPending.textContent = "Mostrar todos";
        buildSpellCards(spellArray);
    }else{
        let newSpellData = await getAllSpells()
        const newSpells = newSpellData.spell

        newSpells.forEach(spell => {
            if (spell.creator === null) {
                spell.creator = 'Desconocido'
            }
            const newSpell = new Spell(
                spell.id,
                spell.name,
                spell.level,
                spell.attack,
                spell.defense,
                spell.damage,
                spell.healing,
                spell.summon,
                spell.action,
                spell.validation_status,
                spell.created_at,
                spell.updated_at,
                spell.creator
            )
            spellArray.push(newSpell)
        })

        buttonShowPending.textContent = "Mostrar Hechizos Pendientes";
        buildSpellCards(spellArray);
    }

    hideLoader(null, 600)
    showingTeacher = !showingTeacher;
})
//Monica
const buttonShowDumbledore = document.getElementById('dumbledore-btn');
if (!roles.includes('dumbledore')) buttonShowDumbledore.style.display = 'none';

let showingDumbledore = true;

buttonShowDumbledore.addEventListener('click', async () => {


    const cardsCreated = document.querySelectorAll('.card')
    console.log(cardsCreated)
    cardsCreated.forEach(card => {
        card.remove()
    })

    let spellArray = []
    if(showingDumbledore){
        let newSpellData = await getPendingDumbledore()
        const newSpells = newSpellData.spell

        newSpells.forEach(spell => {
            if (spell.creator === null) {
                spell.creator = 'Desconocido'
            }
            const newSpell = new Spell(
                spell.id,
                spell.name,
                spell.level,
                spell.attack,
                spell.defense,
                spell.damage,
                spell.healing,
                spell.summon,
                spell.action,
                spell.validation_status,
                spell.created_at,
                spell.updated_at,
                spell.creator
            )
            spellArray.push(newSpell)
        })

        buttonShowDumbledore.textContent = "Mostrar todos";
        buildSpellCards(spellArray);
    }else{
        let newSpellData = await getAllSpells()
        const newSpells = newSpellData.spell

        newSpells.forEach(spell => {
            if (spell.creator === null) {
                spell.creator = 'Desconocido'
            }
            const newSpell = new Spell(
                spell.id,
                spell.name,
                spell.level,
                spell.attack,
                spell.defense,
                spell.damage,
                spell.healing,
                spell.summon,
                spell.action,
                spell.validation_status,
                spell.created_at,
                spell.updated_at,
                spell.creator
            )
            spellArray.push(newSpell)
        })

        buttonShowDumbledore.textContent = "Mostrar Hechizos Pendientes Para Dumbledore";
        buildSpellCards(spellArray);
    }

    hideLoader(null, 600)
    showingDumbledore = !showingDumbledore;
})
//Monica
const buttonShowLearned = document.getElementById('student-btn');
if (!roles.includes('student')) buttonShowLearned.style.display = 'none';

let showingLearned = true;

buttonShowLearned.addEventListener('click', async () => {
    const cardsCreated = document.querySelectorAll('.card');
    cardsCreated.forEach(card => {
        card.remove();
    });

    let spellArray = [];
    if (showingLearned) {
        let newSpellData = await getSpellLearned();
        const newSpells = newSpellData.spell;

        newSpells.forEach(spell => {
            if (spell.creator === null) {
                spell.creator = 'Desconocido';
            }
            const newSpell = new Spell(
                spell.id,
                spell.name,
                spell.level,
                spell.attack,
                spell.defense,
                spell.damage,
                spell.healing,
                spell.summon,
                spell.action,
                spell.validation_status,
                spell.created_at,
                spell.updated_at,
                spell.creator
            );
            spellArray.push(newSpell);
        });

        buttonShowLearned.textContent = "Hechizos no aprendidos";
        buildLearnedCards(spellArray);
    } else {
        let newSpellData = await getStudentSpells();
        const newSpells = newSpellData.spell;

        newSpells.forEach(spell => {
            if (spell.creator === null) {
                spell.creator = 'Desconocido';
            }
            const newSpell = new Spell(
                spell.id,
                spell.name,
                spell.level,
                spell.attack,
                spell.defense,
                spell.damage,
                spell.healing,
                spell.summon,
                spell.action,
                spell.validation_status,
                spell.created_at,
                spell.updated_at,
                spell.creator
            );
            spellArray.push(newSpell);
        });

        buttonShowLearned.textContent = "Hechizos aprendidos";
        buildSpellCards(spellArray);
    }

    hideLoader(null, 600);
    showingLearned = !showingLearned;
});

//Monica
const buildLearnedCards = async (spellArray) => {
    const spellContainer = document.querySelector('#spell_cards');

    for (const spell of spellArray) {
        const img = selectImage(spell);

        const card = document.createElement('div');
        card.classList.add('card', 'rounded-5', 'learned-spell');
        card.innerHTML = `
            <div class="card-body rounded-5 d-flex flex-column align-items-center bg-gradient-spell p-4">
                <img id="spell-img" class="card-img-top bg-shadow-spell object-fit-contain" src="${img}" alt="Spell Image" height="100%" width="100%">
                <h5 class="card-title mb-3 text-primary-person text-shadow-person text-center fs-3">${spell.name}</h5>
                <p class="card-text text-shadow-person text-primary-person text-center fs-5">Creador: ${spell.creator}</p>
                <button class="btn my-1 w-75 bg-secondary-person text-primary-person text-shadow-person fs-5 px-5">Más detalles</button>
                <div class="btn-group align-content-stretch"></div>
            </div>
        `;
        const buttonGroup = card.querySelector('.btn-group');

        const button = card.querySelector('.btn');
        button.addEventListener('click', () => {
            openSpellDetails(spell);
        });

        spellContainer.appendChild(card);

    }
    hideLoader(null, 600)
}
//Monica
const openEditSpellModal = (spell) => {
    const editSpellModalElement = document.getElementById('updateSpell');
    const editSpellModal = new bootstrap.Modal(editSpellModalElement);
    editSpellModal.show();

    // Rellenar los campos con los valores del hechizo
    document.getElementById('edit-spell-name').value = spell.name;
    document.getElementById('edit-spell-level').value = spell.level;
    document.getElementById('edit-spell-attack').value = spell.attack;
    document.getElementById('edit-spell-defense').value = spell.defense;
    document.getElementById('edit-spell-damage').value = spell.damage;
    document.getElementById('edit-spell-healing').value = spell.healing;
    document.getElementById('edit-spell-summon').value = spell.summon;
    document.getElementById('edit-spell-action').value = spell.action;
    document.getElementById('edit-spell-creator').checked = spell.creator;

    const editSpellForm = document.getElementById('updateSpellForm');
    editSpellForm.onsubmit = async (e) => {
        e.preventDefault(); // Evitar recarga del formulario

        const updatedSpell = {
            id: spell.id, // ID del hechizo
            name: document.getElementById('edit-spell-name').value,
            level: document.getElementById('edit-spell-level').value,
            attack: document.getElementById('edit-spell-attack').value,
            defense: document.getElementById('edit-spell-defense').value,
            damage: document.getElementById('edit-spell-damage').value,
            healing: document.getElementById('edit-spell-healing').value,
            summon: document.getElementById('edit-spell-summon').value,
            action: document.getElementById('edit-spell-action').value,
            creator: document.getElementById('edit-spell-creator').checked // Usar .checked
        };

        try {
            const response = await updateSpell(spell.id, updatedSpell);
            console.log('Spell updated:', response);
            window.location.reload();

        } catch (error) {
            console.error('Error updating spell:', error);

        }
    };
};
//Monica
const openSpellDetails = (spell) => {

    const spellModalElement = document.getElementById('spellModal');
    spellModalElement.removeAttribute('aria-hidden');
    spellModalElement.removeAttribute('inert');

    const spellModal = new bootstrap.Modal(spellModalElement);
    spellModal.show();

    const modal = document.querySelector('.modal-body');
    const spellDetails = `
               <strong>Nombre:</strong> ${spell.name}<br>
               <strong>Ataque:</strong> ${spell.attack}<br>
               <strong>Defensa:</strong> ${spell.defense}<br>
               <strong>Daño:</strong> ${spell.damage}<br>
               <strong>Sanación:</strong> ${spell.healing}<br>
               <strong>Invocación:</strong> ${spell.summon}<br>
               <strong>Acción:</strong> ${spell.action}<br>
               <strong>Estado de Validación:</strong> ${spell.validation_status}<br>
               <strong>Creador:</strong> ${spell.creator}<br>
               <strong>Nivel:</strong> ${spell.level}<br>
           `;
    modal.innerHTML = spellDetails;

}
//Monica
const collapseForm = document.querySelector('#collapseForm')
collapseForm.addEventListener('show.bs.collapse', () => {
    // console.log('Acordeón abierto');
})
collapseForm.addEventListener('hide.bs.collapse', () => {
    // console.log('Acordeón cerrado');
})

const togleAccordion = document.querySelector('.accordion-button')

togleAccordion.addEventListener('click', () => {
    const isShow = collapseForm.classList.contains('show')
    const collapse = new bootstrap.Collapse(collapseForm)
    if (isShow){
        collapse.hide()
    }else{
        collapse.show()
    }
})
//Monica
const buttonAcordeon = document.querySelector('.btn-accordion')
buttonAcordeon.addEventListener('click', async (e) => {
    //createNewSpell()
    e.preventDefault()

    const name = document.getElementById('spell-name')
    const level = document.getElementById('spell-level')
    const attack = document.getElementById('spell-attack')
    const defense = document.getElementById('spell-defense')
    const damage = document.getElementById('spell-damage')
    const healing = document.getElementById('spell-healing')
    const summon = document.getElementById('spell-summon')
    const action = document.getElementById('spell-action')
    const creator = document.getElementById('spell-creator')

    creator.value = creator.checked;

    // console.log(creator.value)

    if (validateForm([name, level, attack, defense, damage, healing, summon, action])) {
        const data = {
            name: name.value,
            level: Math.ceil(level.value),
            attack: Math.ceil(attack.value),
            defense: Math.ceil(defense.value),
            damage: Math.ceil(damage.value),
            healing: Math.ceil(healing.value),
            summon: Math.ceil(summon.value),
            action: Math.ceil(action.value),
            hasCreator: creator.value
        }

            try{
                await createSpell(data)
                    .then(data => {
                        if (data.success){
                            window.location.reload()
                        }

                    })
            }catch (error) {
                console.error('Error al crear usuario:', error);
            }
        }

})
//Monica
const validateForm = (inputs) => {
    let isValid = true;
    const isPersonalSpell = document.getElementById('spell-creator').checked;

    inputs.forEach((input, index) => {
        if (isPersonalSpell && index === 1) {
            return;
        }

        if (!validation.validateIsNotEmpty(input.value)) {
            isValid = false;
            if (!input.classList.contains('is-invalid')) {
                input.classList.add('is-invalid');
            }
        } else {
            input.classList.remove('is-invalid');
        }
    });

    isValid = validateName(inputs[0], isValid) && isValid;
    if (!isPersonalSpell) {
        isValid = validateLevel(inputs[1], isValid) && isValid;
    }
    isValid = validateAttribute(inputs[2], isValid) && isValid;
    isValid = validateAttribute(inputs[3], isValid) && isValid;
    isValid = validateAttribute(inputs[4], isValid) && isValid;
    isValid = validateAttribute(inputs[5], isValid) && isValid;
    isValid = validateAttribute(inputs[6], isValid) && isValid;
    isValid = validateAttribute(inputs[7], isValid) && isValid;

    return isValid;
};
//Monica
const validateName = (name, valid) => {
    let isValid = validation.validateName(name.value);

    if (!isValid) {
        name.classList.add('is-invalid');
    } else if (!valid && name.classList.contains('is-invalid')) {
        name.classList.remove('is-invalid');
    }

    return isValid;
}
//Monica
const validateLevel = (level, valid) => {
    let isValid = validation.validateLevel(level.value);

    if (!isValid) {
        level.classList.add('is-invalid');
    } else if (!valid && level.classList.contains('is-invalid')) {
        level.classList.remove('is-invalid');
    }

    return isValid;
}
//Monica
const validateAttribute = (attribute, valid) => {
    attribute.value = Math.ceil(attribute.value);
    let isValid = validation.validateAttribute(attribute.value);

    if (!isValid || attribute.value.trim() === '') {
        attribute.classList.add('is-invalid');
    } else if (valid && attribute.classList.contains('is-invalid')) {
        attribute.classList.remove('is-invalid');
    }

    return isValid;
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click', handleLogout)
    }
}



//Monica
buildLoader()
showLoader()
createSpells()
// await displayPendingSpells()
// getSpellPending()
await buildSpellCards(spellArray)

buildHeader()
showLogoutButton()
setupLogoutBtn()
buildFooter()

