import '../../scss/styles.scss';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {removeToken} from "../../../storage/tokenManager";
import { getSpells, createSpell } from "./spell-provider";
import { Spell } from "./Spell";
import * as validation from "./validation";



const spellData = await getSpells()
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

const buildSpellCards = async () => {
    const spellContainer = document.querySelector('#spell_cards');

    for (const spell of spellArray) {
        const img = selectImage(spell);

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-body custom-body">
                <img id="spell-img" class="card-img-top" src="${img}" alt="Spell Image">
                <h5 class="card-title">${spell.name}</h5>
                <p class="card-text">Creador: ${spell.creator}</p>
                <button class="btn">Abrir detalles</button>
            </div>
        `;

        const button = card.querySelector('.btn');
        button.addEventListener('click', () => {
            openSpellDetails(spell);
        });

        spellContainer.appendChild(card);
    }
};

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


const accordion = document.querySelector('#spellAccordion')
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



    console.log(creator.value)


    if (validateForm([name, level, attack, defense, damage, healing, summon, action]) && validateName(name) && validateLevel(level.value) && validateAttribute(attack.value) && validateAttribute(defense.value) && validateAttribute(damage.value) && validateAttribute(healing.value) && validateAttribute(summon.value) && validateAttribute(action.value)) {
        const data = {
            name: name.value,
            level: level.value,
            attack: attack.value,
            defense: defense.value,
            damage: damage.value,
            healing: healing.value,
            summon: summon.value,
            action: action.value,
            hasCreator: creator.value

        }

        try{
            await createSpell(data)
                .then(data => {
                    console.log(data)
                    if (data.success){
                        window.location.reload()
                    }

                })
        }catch (error) {
            console.error('Error al crear usuario:', error);
        }



    }

})

const validateForm = (inputs) => {
    let isValid = true;

   inputs.forEach(input => {
       if (!validation.validateIsNotEmpty(input.value)) {
           isValid = false;
           if (!input.classList.contains('is-invalid')) {
               input.classList.add('is-invalid'); // Marca como inválido
           }
       } else {
           input.classList.remove('is-invalid'); // Remueve la clase si es válido
       }
   })

    return isValid;
};



const validateName = (name) =>{
    let isValid = validation.validateName(name.value)
    if (!isValid) {
        document.querySelector('#spell-name').classList.add('is-invalid')
    }else {
        document.querySelector('#spell-name').classList.remove('is-invalid')
    }

    return isValid;
}

const validateLevel = (level) =>{
    let isValid = validation.validateLevel(level)
    if (!isValid) {
        document.querySelector('#spell-level').classList.add('is-invalid')
    }else {
        document.querySelector('#spell-level').classList.remove('is-invalid')
    }

    return isValid;
}

const validateAttribute = (attack) =>{
    let isValid = validation.validateAttribute(attack)
    if (!isValid) {
        document.querySelector('#spell-attack').classList.add('is-invalid')
    }else {
        document.querySelector('#spell-attack').classList.remove('is-invalid')
    }
    return isValid;
}




const logout = () => {
    removeToken()
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click',logout)
    }
}

createSpells()
await buildSpellCards()


buildHeader()
showLogoutButton()
setupLogoutBtn()
buildFooter()

