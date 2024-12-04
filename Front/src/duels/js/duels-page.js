import {buildLoader, showLoader, hideLoader} from "../../components/buildLoader";
import {buildHeader, showLogoutButton, hideLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {getSpellLearned} from "../../spell/js/spell-provider";
import {apiGetDuelById, apiCastSpells} from "./duels-provider";


const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="deck" id="deckMachine"></div>
        <div class="area d-flex gap-4">
            <div class="selection-area" id="selectionAreaUser"></div>
            <div class="d-flex flex-column align-items-center">
                <button class="btn w-30 h-auto p-2 fs-6 border-0 border-bottom rounded-0 text-primary-person bg-hepta-person text-shadow-person" id="btnCastSpells">
                    lanzar hechizo
                </button>
                <div id="duelInfo"></div>
            </div>
            <div class="selection-area" id="selectionAreaMachine"></div>
        </div>
        <div class="deck" id="deckUser"></div>
    `;

    const btnCastSpells = document.getElementById('btnCastSpells');
    if (btnCastSpells) {
        btnCastSpells.addEventListener('click', () => {
           castSpells();
        });
    }
}

const castSpells = () => {
    // Se optiene el hechizo seleccionado
    const selectionAreaUser = document.getElementById('selectionAreaUser');
    const selectedCard = selectionAreaUser.querySelector('.card-up');
    if(selectedCard){
        const selectedSpell = selectedCard.getAttribute('data');
        apiCastSpells(JSON.parse(selectedSpell), duelModel).then( response => {
            console.log(response)
        });
    }else{
        alert('Debe seleccionar un hechiso antes de poder lanzarlo')
    }
}

// Genera los efectos de movimientos de las cartas de la maquina
const efectSelectionMachine = (deckMachine) => {
    const selectionAreaMachine = document.getElementById('selectionAreaMachine');
    if(!selectionAreaMachine.querySelector('.card-down')){
        const selectionMachineIndex = Math.floor(Math.random() * 5)
        const cardsMachine = deckMachine.querySelectorAll('.card-down')
        const cardSelectedMachine = cardsMachine[selectionMachineIndex]

        // Obtener la posición inicial de la carta y la posición del destino
        const cardRect = cardSelectedMachine.getBoundingClientRect();
        const destRect = selectionAreaMachine.getBoundingClientRect();

        // Calcular la distancia de movimiento
        const deltaX = destRect.left - cardRect.left + 10;
        const deltaY = destRect.top - cardRect.top + 10;

        // Aplicar la animación (transformación)
        cardSelectedMachine.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // Cuando la animación termine, mover realmente la carta al destino
        cardSelectedMachine.addEventListener( 'transitionend',
            () => {
                // Resetear transformaciones y mover la carta al nuevo contenedor
                cardSelectedMachine.style.transform = '';
                selectionAreaMachine.appendChild(cardSelectedMachine)
            },
            { once: true }
        );
    }
}

// Genera los efectos de movimientos de las cartas del usuario
const efectSelectionUser = (deckUser, cardSelectedUser) => {
    const selectionAreaUser = document.getElementById('selectionAreaUser');
    if(!selectionAreaUser.querySelector('.card-up')){

        // Obtener la posición inicial de la carta y la posición del destino
        const cardRect = cardSelectedUser.getBoundingClientRect();
        const destRect = selectionAreaUser.getBoundingClientRect();

        // Calcular la distancia de movimiento
        const deltaX = destRect.left - cardRect.left + 10;
        const deltaY = destRect.top - cardRect.top + 10;

        // Aplicar la animación (transformación)
        cardSelectedUser.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // Cuando la animación termine, mover realmente la carta al destino
        cardSelectedUser.addEventListener( 'transitionend',
            () => {
                // Resetear transformaciones y mover la carta al nuevo contenedor
                cardSelectedUser.style.transform = '';
                selectionAreaUser.appendChild(cardSelectedUser)
            },
            { once: true }
        );
    }
}

const buildDecks = () => {
    // se recupera el id del duelo que viene de la pagina start-page.js, puede ser el id de un duelo recien creado o
    // el id de un duelo ya empezado que se desea continuar
    const duelId = localStorage.getItem('duelId');
    apiGetDuelById(duelId).then(duel => {
        duelModel = duel
        // Se carga y muestra la información del duelo
        const divInfo = document.getElementById('duelInfo');
        divInfo.innerHTML = `
            <div>ID: ${duel.id}</div>
            <div>Vida maquina: ${duel.life_machine}</div>
            <div>Puntos maquina: ${duel.points_machine}</div>
            <div>Vida usuario: ${duel.life_user}</div>
            <div>Puntos usuario: ${duel.points_user}</div>
            <div>Rondas: ${duel.round}</div>
            <div>Resultado: ${duel.result}</div>
        `;

        // Se genera el mazo de la maquina
        const deckMachine = document.getElementById('deckMachine');
        for (let i = 0; i < 5; i++) {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card-down');
            cardElement.setAttribute('id', i);
            deckMachine.appendChild(cardElement);
        }

        // Se genera el mazo del Usuario
        getSpellLearned().then( response => {
            // Se recuperan los hechizos aprendidos por el usuario y se crean cartas dinamicamente
            const spellLearned = response['spell']
            const deckUser = document.getElementById('deckUser');
            let selectedCard = null;

            spellLearned.forEach(spell => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card-up');
                cardElement.setAttribute('id', spell.id);
                cardElement.setAttribute('data', JSON.stringify(spell));
                cardElement.innerHTML = `
                    <div class="d-flex flex-column p-4">
                        <div class="title mb-4 text-center fw-bold">${spell.name}</div>
                        <div>Ataque: ${spell.attack}</div>
                        <div>Defensa: ${spell.defense}</div>
                        <div>Vida: ${spell.healing}</div>
                        <div>Daño: ${spell.damage}</div>
                         <!--<div>Invocación: ${spell.summon}</div>
                         <div>Accion: ${spell.action}</div>-->
                        
                    </div>
                `;
                cardElement.addEventListener("click", (e) => {
                    const card = e.target.closest('.card-up')
                    if(card){
                        // si la carta que se pincha esta dentro del mazo, se lleva del mazo a la zona de selección.
                        // Y, si no, la carta que se ha pinchado esta en la zona de selección y lo que se hace es retirarla al mazo
                        if (card.parentNode === deckUser) {
                            // solo puede haber una carta de hechizo seleccionada al mismo tiempo
                            if(!selectedCard){
                                // se guarda la carta seleccionada y se desencadena el efecto de movimiento para la carta del usuario
                                selectedCard = card
                                efectSelectionUser(deckUser, card)

                                // cuando se selecciona un hechizo se desencadena que la maquina elija el suyo (no se elige de
                                // verdad en este momento, es una simulación, la elección se hara en back)
                                setTimeout(efectSelectionMachine, 600, deckMachine);
                            }
                        }else{
                            deckUser.appendChild(card)
                            selectedCard = null
                        }
                    }
                });
                deckUser.appendChild(cardElement);
            });

            hideLoader()
        });
    })
}


// Flujo principal
let duelModel = null;
buildLoader()
buildHeader()
buildFooter()
buildBody()
buildDecks()
