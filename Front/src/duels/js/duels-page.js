import {buildLoader, showLoader, hideLoader} from "../../components/buildLoader";
import {buildHeader, showLogoutButton, hideLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {getSpellLearned} from "../../spell/js/spell-provider";
import {apiGetDuelById, apiCastSpells} from "./duels-provider";
import {showToastMessages} from "../../js/messages";

// Calcula la imagen de la carta en función del hechizo
const selectImage = (spell) => {
    let img = '';
    const maxCharacteristic = Math.max(spell.attack, spell.defense, spell.damage, spell.healing, spell.summon, spell.action);

    if (maxCharacteristic === spell.attack) {
        img = '../../assets/img/spell-attack.png';
    } else if (maxCharacteristic === spell.defense) {
        img = '../../assets/img/spell-defense.png';
    } else if (maxCharacteristic === spell.damage) {
        img = '../../assets/img/spell-damage.png';
    } else if (maxCharacteristic === spell.healing) {
        img = '../../assets/img/spell-healing.png';
    } else if (maxCharacteristic === spell.summon) {
        img = '../../assets/img/spell-summon.png';
    } else if (maxCharacteristic === spell.action) {
        img = '../../assets/img/spell-action.png';
    }

    return img;
};

const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="deck" id="deckMachine"></div>
        <div class="area d-flex gap-4">
            <div class="info d-flex flex-column px-3 py-2" id="infoUser"></div>
            <div class="selection-area" id="selectionAreaUser"></div>
            <div class="d-flex flex-column align-items-center justify-content-center">
                <div id="duelInfo" class="info mb-4 h-50 p-4 d-flex flex-column justify-content-center align-items-center"></div>
                <button class="btn w-30 h-auto p-2 fs-6 border-0 border-bottom rounded-0 text-primary-person bg-hepta-person text-shadow-person" id="btnCastSpells">
                    lanzar hechizo
                </button>
            </div>
            <div class="selection-area" id="selectionAreaMachine"></div>
            <div class="info px-3 py-2" id="infoMachine"></div>
        </div>
        <div class="deck" id="deckUser"></div>
    `;

    const btnCastSpells = document.getElementById('btnCastSpells');
    if (btnCastSpells) {
        btnCastSpells.addEventListener('click', () => {
            if(duelModel.result === 0){
                if(blockActive){
                    nextRound();
                }else{
                    castSpells();
                }
            }else{
                duelFinish()
            }

        });
    }
}

// Logica para avanzar de rondas
const nextRound = () => {
    const btnCastSpells = document.getElementById('btnCastSpells')
    btnCastSpells.textContent = 'lanzar hechizo'

    blockActive = false
    selectedCard = null

    const infoDuelRound = document.getElementById('infoDuelRound')
    duelModel.round = duelModel.round + 1 // volvemos a recuperar el numero de ronda que restamos
    infoDuelRound.textContent = duelModel.round + 1

    destroyCards()
}

// Lanza el hechizo seleccionado
const castSpells = () => {
    showLoader()
    const selectionAreaUser = document.getElementById('selectionAreaUser');
    const selectedCardUser = selectionAreaUser.querySelector('.card-up');
    if(selectedCardUser){
        const selectedSpell = selectedCardUser.getAttribute('data');
        apiCastSpells(JSON.parse(selectedSpell), duelModel).then( response => {
            if(response.duel){
                // Se bloquea los eventos de cartas hasta que el usuario pinche en siguiente ronda
                blockActive = true;
                response.duel.round = response.duel.round - 1 // se resta uno temporalmente hasta que pulse el boton de pasar de ronda
                duelModel = response.duel;

                // se recarga la info
                loadInfoDuel(response.duel)

                // se descubre la carta de la maquina
                flipCardMachine(response.duel);

                // Se cambia el texto del boton lanzar hechizo para que sea siguiente ronda
                const btnCastSpells = document.getElementById('btnCastSpells')
                btnCastSpells.textContent = 'siguiente ronda'

                hideLoader()
            }
            else if (response.codError){
                const errorCode = response.codError
                if(errorCode === 100){
                    showToastMessages("El hechizo no existe")
                }
                if(errorCode === 101){
                    showToastMessages("No se ha podido encontrar el duelo")
                }
                if(errorCode === 102){
                    showToastMessages("Este duelo ya esta finalizado, no se pueden lanzar hechizos")
                }
                if(errorCode === 103){
                    showToastMessages("El hechizo seleccionado ya se ha lanzado")
                }
                if(errorCode === 104){
                    showToastMessages("El hechizo seleccionado no se ha aprendido por el usuario")
                }
                if(errorCode === 104){
                    showToastMessages("Error en el servidor con los datos del oponente")
                }
                console.error(response)
                hideLoader()
            }
            else {
                console.error(response)
                showToastMessages("Error inesperado en el servidor")
                hideLoader()
            }
        });
    }else{
        showToastMessages('Debe seleccionar un hechizo antes de poder lanzarlo',false)
        hideLoader()
    }
}


//Vaciar el contenedor y mostrar el mensaje de perdedor o ganador
const duelFinish = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.classList.add('container', 'custom-scroll', 'mt-4', 'mb-2')
    mainContent.innerHTML = '';

    const container = document.createElement('div');
    container.classList.add('pb-5', 'd-flex', 'flex-column', 'align-items-center', 'bg-octa-person', 'w-100', 'p-2');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('col', 'text-center', 'text-primary-person', 'bg-octa-person', 'fs-3', 'py-3', 'p-4', 'text-shadow-person', 'bg-dark');
    if (duelModel.result === 1) {
        messageDiv.textContent = '¡Has ganado!';
    } else if (duelModel.result === 2) {
        messageDiv.textContent = '¡Has perdido!';
    } else if (duelModel.result === 3) {
        messageDiv.textContent = '¡Empate!';
    }
    container.appendChild(messageDiv);

    const userSpells = duelModel.spells_used.filter(spell => spell.pivot.id_user === duelModel.user_id);
    const machineSpells = duelModel.spells_used.filter(spell => spell.pivot.id_user !== duelModel.user_id);

    // Crear la tabla de resumen
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-hover', 'bg-octa-person', 'text-center', 'table-sm');

    const tableHeader = document.createElement('thead');
    tableHeader.classList.add('bg-octa-person', 'text-primary-person', 'fs-4');
    tableHeader.innerHTML = `
        <tr>
            <th class="text-center bg-octa-person text-primary-person fs-5">Vida usuario</th>
            <th class="text-center bg-octa-person text-primary-person fs-5">Vida máquina</th>
            <th class="text-center bg-octa-person text-primary-person fs-5">Rondas</th>
            <th class="text-center bg-octa-person text-primary-person fs-5">Hechizos usados usuario</th>
            <th class="text-center bg-octa-person text-primary-person fs-5">Hechizos usados máquina</th>
        </tr>
    `;
    table.appendChild(tableHeader);

    const tableBody = document.createElement('tbody');
    tableBody.classList.add('align-middle');
    tableBody.innerHTML = `
        <tr>
            <td class="text-center bg-octa-person text-primary-person fs-5">${duelModel.life_user}</td>
            <td class="text-center bg-octa-person text-primary-person fs-5">${duelModel.life_machine}</td>
            <td class="text-center bg-octa-person text-primary-person fs-5">${duelModel.round}</td>
            <td class="text-center bg-octa-person text-primary-person fs-5">
                <ul class="list-unstyled">
                    ${userSpells.map(spell => `<li>${spell.name}</li>`).join('')}
                </ul>
            </td>
            <td class="text-center bg-octa-person text-primary-person fs-5">
                <ul class="list-unstyled">
                    ${machineSpells.map(spell => `<li>${spell.name}</li>`).join('')}
                </ul>
            </td>
        </tr>
    `;
    table.appendChild(tableBody);
    container.appendChild(table);

    mainContent.appendChild(container);

    hideLoader();
}


// Genera los efectos de movimientos de las cartas de la maquina
const efectSelectionMachine = (deckMachine) => {
    const selectionAreaMachine = document.getElementById('selectionAreaMachine');
    if(!selectionAreaMachine.querySelector('.card-down')){
        // Se genera un numero al azar para simular que la maquina escoge una carta y no sea simpre la misma
        const selectionMachineIndex = Math.floor(Math.random() * deckMachine.childElementCount)
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

// Genera y muestra la info del duelo (rondas, vida, puntos, etc)
const loadInfoDuel = (duel) => {
    // Limpiar la información existente antes de añadir nuevos datos
    document.getElementById('infoUser').innerHTML = '';
    document.getElementById('infoMachine').innerHTML = '';
    document.getElementById('duelInfo').innerHTML = '';

    // Se carga la info del usuario
    const infoUser = document.getElementById('infoUser');
    infoUser.innerHTML = `<div class="title text-center mt-2 mb-3">${localStorage.getItem('name')}</div>`
    let div = document.createElement('div');

    // Crear la barra de vida del usuario
    const userLifeContainer = document.createElement('div');
    userLifeContainer.style.marginBottom = '20px';
    const userLifeLabelContainer = document.createElement('div')
    userLifeLabelContainer.classList.add('d-flex', 'justify-content-between');
    userLifeContainer.appendChild(userLifeLabelContainer)

    // Etiqueta de vida del usuario
    const userLifeLabel = document.createElement('div');
    userLifeLabel.textContent = 'Vida';
    userLifeLabelContainer.appendChild(userLifeLabel);
    const userLifeLabelPorcent = document.createElement('div');
    userLifeLabelPorcent.textContent = `${duel.life_user}%`
    userLifeLabelContainer.appendChild(userLifeLabelPorcent);

    // Barra de vida del usuario
    const userLifeBar = document.createElement('div');
    userLifeBar.style.width = '100%';
    userLifeBar.style.backgroundColor = '#e0e0e0';
    userLifeBar.style.border = '1px solid #ccc';
    userLifeBar.style.position = 'relative';

    const userFilledBar = document.createElement('div');
    userFilledBar.style.height = '20px';
    userFilledBar.style.backgroundColor = '#4caf50';
    userFilledBar.style.width = `${duel.life_user}%`;
    userLifeBar.appendChild(userFilledBar);

    userLifeContainer.appendChild(userLifeBar);

    // Etiqueta y puntuación del usuario
    const userPointsContainer = document.createElement('div');
    const userPointsLabel = document.createElement('div');
    userPointsLabel.classList.add('text-center')
    userPointsLabel.textContent = 'Rondas ganadas';
    userPointsContainer.appendChild(userPointsLabel);

    const userPointsValue = document.createElement('div');
    userPointsValue.classList.add('text-center', 'mt-2', 'h1')
    userPointsValue.textContent = duel.points_user;
    userPointsContainer.appendChild(userPointsValue);

    // Añadir al div principal del usuario
    div.appendChild(userLifeContainer);
    div.appendChild(userPointsContainer);
    infoUser.appendChild(div);


    // Se carga la info de la máquina
    const infoMachine = document.getElementById('infoMachine');
    infoMachine.innerHTML = `<div class="title text-center mt-2 mb-3">Oponente</div>`
    div = document.createElement('div')

    // Crear la barra de vida de la máquina
    const machineLifeContainer = document.createElement('div')
    machineLifeContainer.style.marginBottom = '20px'
    const machineLifeLabelContainer = document.createElement('div')
    machineLifeLabelContainer.classList.add('d-flex', 'justify-content-between');
    machineLifeContainer.appendChild(machineLifeLabelContainer)

    // Etiqueta de vida de la máquina
    const machineLifeLabel = document.createElement('div');
    machineLifeLabel.textContent = 'Vida'
    machineLifeLabelContainer.appendChild(machineLifeLabel);

    const machineLifeLabelPorcent = document.createElement('div');
    machineLifeLabelPorcent.textContent = `${duel.life_machine}%`
    machineLifeLabelContainer.appendChild(machineLifeLabelPorcent);

    // Barra de vida de la máquina
    const machineLifeBar = document.createElement('div')
    machineLifeBar.style.width = '100%'
    machineLifeBar.style.backgroundColor = '#e0e0e0'
    machineLifeBar.style.border = '1px solid #ccc'
    machineLifeBar.style.position = 'relative';

    const machineFilledBar = document.createElement('div')
    machineFilledBar.style.height = '20px';
    machineFilledBar.style.backgroundColor = '#4caf50'
    machineFilledBar.style.width = `${duel.life_machine}%`
    machineLifeBar.appendChild(machineFilledBar);

    machineLifeContainer.appendChild(machineLifeBar);

    // Etiqueta y puntuación de la máquina
    const machinePointsContainer = document.createElement('div');
    const machinePointsLabel = document.createElement('div')
    machinePointsLabel.classList.add('text-center')
    machinePointsLabel.textContent = 'Rondas ganadas'
    machinePointsContainer.appendChild(machinePointsLabel)

    const machinePointsValue = document.createElement('div');
    machinePointsValue.classList.add('text-center', 'mt-2', 'h1')
    machinePointsValue.textContent = duel.points_machine;
    machinePointsContainer.appendChild(machinePointsValue)

    // Añadir al div principal de la máquina
    div.appendChild(machineLifeContainer);
    div.appendChild(machinePointsContainer);
    infoMachine.appendChild(div);

    // Se carga la info del duelo
    const infoDuel = document.getElementById('duelInfo');
    infoDuel.innerHTML = `
        <div>
            <div class="title">Ronda</div>
            <div class="text-center h1" id="infoDuelRound">${duel.round + 1}</div>
        </div>
        <div class="d-none">Resultado: ${duel.result}</div>
    `;
}

// Revela la carta elegida por la maquina y le da la vuelta
const flipCardMachine = (duel) => {
    const selectionAreaMachine = document.querySelector('#selectionAreaMachine')
    const card = selectionAreaMachine.querySelector('.card-down')
    if(card){
        // Sacamos el ultimo hechizo lanzado por la maquina
        const spell = duel.spells_used.filter(spell => spell.pivot.id_user !== duelModel.user_id)
            .reduce((maxSpell, spell) => {
                return spell.pivot.id > (maxSpell?.pivot.id || 0) ? spell : maxSpell;
            }, null);

        card.classList.remove('card-down')
        card.classList.add('card-up', 'bg-gradient-spell')
        card.innerHTML = `
            <div class="d-flex flex-column p-3 h-100 tooltip-container">
                <div class="h-100 bg-shadow-spell" style="background-image: url('${selectImage(spell)}'); background-size: cover; background-position: center"></div>
                <div class="title text-center text-white">${spell.name}</div>
                <div class="tooltip">
                            <div class="tooltip-item">
                                <span class="label">Ataque:</span>
                                <span class="value">${spell.attack}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Defensa:</span>
                                <span class="value">${spell.defense}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Curación:</span>
                                <span class="value">${spell.healing}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Daño:</span>
                                <span class="value">${spell.damage}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Convocación:</span>
                                <span class="value">${spell.summon}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Acción:</span>
                                <span class="value">${spell.action}</span>
                            </div>
                        </div>
            </div>
        `;
    }
}

// limpia las cartas usadas cuando se termina la ronda.
const destroyCards = () => {
    const selectionAreaUser = document.querySelector('#selectionAreaUser')
    const selectionAreaMachine = document.querySelector('#selectionAreaMachine')

    const cardUser = selectionAreaUser.querySelector('.card-up')
    if(cardUser){
        cardUser.remove()
    }

    const  cardMachine = selectionAreaMachine.querySelector('.card-up')
    if(cardMachine){
        cardMachine.remove()
    }
}

const buildDecks = () => {
    // se recupera el id del duelo que viene de la pagina start-page.js, puede ser el id de un duelo recien creado o
    // el id de un duelo ya empezado que se desea continuar
    const duelId = localStorage.getItem('duelId');
    apiGetDuelById(duelId).then(duel => {
        // Se guarda el modelo recuperado
        duelModel = duel

        if(duelModel.result === 0){
            // Se carga y muestra la información del duelo (rondas, vida, puntos..)
            loadInfoDuel(duel);

            // Se genera el mazo de la maquina, este mazo es falso, no contiene ningun hechizo porque esta elección se hace
            // en el servidor pero se genera para simular el juego.
            // se calcula cuantas cartas se pintaran para la maquina, porque se puede dar el caso de estar cargando un duelo empezado
            const numberCardMachine = 5 - duelModel.round
            const deckMachine = document.getElementById('deckMachine');
            for (let i = 0; i < numberCardMachine; i++) {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card-down');
                cardElement.setAttribute('id', i);
                deckMachine.appendChild(cardElement);
            }

            // Se genera el mazo del Usuario
            getSpellLearned().then( response => {
                // Se recuperan los hechizos aprendidos por el usuario
                const spellLearned = response['spell']

                // Se filtran los hechizos aprendidos que ya ha lanzado el usuario en el duelo, esto se hace porque se puede
                // dar el caso de estar cargando un duelo ya comenzado o recargando la pagina
                const usedSpellsUser = duelModel.spells_used.filter(spell => spell.pivot.id_user === duelModel.user_id).map(spell => spell.id)
                const availableSpellsUser = spellLearned.filter( spell => !usedSpellsUser.includes(spell.id));

                // Se crean cartas para representar cada hechizo
                const deckUser = document.getElementById('deckUser');
                availableSpellsUser.forEach(spell => {
                    const cardElement = document.createElement('div');
                    cardElement.classList.add('card-up', 'bg-gradient-spell');
                    cardElement.setAttribute('id', spell.id);
                    cardElement.setAttribute('data', JSON.stringify(spell));
                    cardElement.innerHTML = `
                    <div class="d-flex flex-column p-3 h-100 tooltip-container">
                        <div class="h-100 bg-shadow-spell" style="background-image: url('${selectImage(spell)}'); background-size: cover; background-position: center"></div>
                        <div class="title text-center text-white">${spell.name}</div>
                        <div class="tooltip">
                            <div class="tooltip-item">
                                <span class="label">Ataque:</span>
                                <span class="value">${spell.attack}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Defensa:</span>
                                <span class="value">${spell.defense}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Curación:</span>
                                <span class="value">${spell.healing}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Daño:</span>
                                <span class="value">${spell.damage}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Convocación:</span>
                                <span class="value">${spell.summon}</span>
                            </div>
                            <div class="tooltip-item">
                                <span class="label">Acción:</span>
                                <span class="value">${spell.action}</span>
                            </div>
                        </div>
                    </div>
                `;
                    cardElement.addEventListener("click", (e) => {
                        const card = e.target.closest('.card-up')
                        if(card && !blockActive){
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
        }
        else{
            //por si se recarga la pagina, que ponga si has ganado o perdido
            duelFinish()
        }


    })
}


// Flujo principal
let duelModel = null;
let blockActive = false;
let selectedCard = null;
buildLoader()
buildHeader()
buildFooter()
buildBody()
buildDecks()
