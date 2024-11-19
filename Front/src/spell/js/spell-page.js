import '../../scss/styles.scss';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {removeToken} from "../../../storage/tokenManager";
import { getSpells } from "./spell-provider";
import { Spell } from "./Spell";



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

const getUser = async (id) => {
    const user = await apiGetUsers(id)

    return user
}

const buildSpellCards = async () => {
    const spellContainer = document.querySelector('#spell_cards');

    for (const spell of spellArray) {

        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <div class="card-body custom-body">
                <h5 class="card-title">${spell.name}</h5>
                <p class="card-text">Creador: ${spell.creator}</p>
               
                <btn class="btn">Abrir detalles</btn>
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

        const spellModal = new bootstrap.Modal(document.getElementById('spellModal'));
        console.log(spellModal)
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

