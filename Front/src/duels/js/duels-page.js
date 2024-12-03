import {buildLoader, showLoader, hideLoader} from "../../components/buildLoader";
import {buildHeader, showLogoutButton, hideLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {getSpellLearned} from "../../spell/js/spell-provider";

const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="d-flex gap-4">
            <div class="selection-area" id="selectionArea"></div>
            <div class="selection-area" id="selectionArea"></div>
        </div>
        <div class="deck" id="deck"></div>
    `;
}

const buildDeck = () => {
    getSpellLearned().then( response => {
        // Se recuperan los hechizos aprendidos por el usuario y se crean cartas dinamicamente
        const spellLearned = response['spell']
        const deck = document.getElementById('deck');
        const selectionArea = document.getElementById('selectionArea');
        let selectedCard = null;

        spellLearned.forEach(spell => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.setAttribute('id', spell.id);
            cardElement.setAttribute('data', JSON.stringify(spell));
            cardElement.innerHTML = `
                <div class="d-flex flex-column p-4">
                    <div class="title mb-4 text-center fw-bold">${spell.name}</div>
                    <div>Ataque: ${spell.attack}</div>
                    <div>Defensa: ${spell.defense}</div>
                    <div>Vida: ${spell.healing}</div>
                    <div>Daño: ${spell.damage}</div>
                </div>
            `;
            cardElement.addEventListener("click", (e) => {
                const card = e.target.closest('.card')
                if(card){
                    // si la carta que se pincha esta dentro del mazo, se lleva del mazo a la zona de selección.
                    // Y, si no, la carta que se ha pinchado esta en la zona de selección y lo que se hace es retirarla al mazo
                    if (card.parentNode === deck) {
                        // solo puede haber una carta de hechizo seleccionada al mismo tiempo
                        if(!selectedCard){
                            selectionArea.appendChild(card)
                            selectedCard = card
                        }
                    }else{
                        deck.appendChild(card)
                        selectedCard = null
                    }
                }
            });
            deck.appendChild(cardElement);
        });

        hideLoader()
    });
}


// Flujo principal
buildLoader()
buildHeader()
buildFooter()
buildBody()
buildDeck()
