import {buildLoader, showLoader, hideLoader} from "../../components/buildLoader";
import {buildHeader, showLogoutButton, hideLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {loadPage} from "../../js/router";
import {apiGetActiveDuels, apiStartDuel} from "./duels-provider";

const buildBody = async () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="row row-cols-1 g-4 justify-content-center">
            <div class="col d-flex justify-content-center">
                  <div id="starDuels" class="card card-uniform bg-octa-person border border-2 border-primary-person h-100">
                        <div id="starDuelsBody" class="card-body d-flex flex-column">
                              <h5 id="starDuelTitle" class="card-title text-primary-person fs-1 py-2 text-center text-shadow-person">Simulación duelo</h5>
                              <p id="startDuelText" class="card-text text-primary-person text-shadow-person mb-3 fs-5">Lanza tus hechizos y domina los duelos mágicos</p>
                              <button id="duelsButton" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Luchar</button>
                        </div>
                  </div>
            </div>
        </div>
        <div id="startedDuelsContainer"></div>
    `;

    const duelsButton = document.getElementById('duelsButton');
    if (duelsButton) {
        duelsButton.addEventListener('click', async() => {
            showLoader();
            await apiStartDuel();
            hideLoader();
            loadPage(`/duels`)
        });
    }

    apiGetActiveDuels().then( response => {
        displayStartedDuels(response.activeDuels)
        hideLoader()
    })
}

const displayStartedDuels = (duels) => {
    const container = document.getElementById('startedDuelsContainer');

    if(!duels || duels.length === 0){
        container.innerHTML = `
            <div class="col text-center text-primary-person fs-5">
                No hay duelos empezados.
            </div>`;
        return;
    }

    let rows = '';
    for (let i = 0; i < duels.length; i++) {
        const duel = duels[i];
        rows += `
            <tr class="bg-octa-person text-primary-person fs-4">
                <td class="text-center bg-octa-person text-primary-person fs-5">${duel.life_user}</td>
                <td class="text-center bg-octa-person text-primary-person fs-5">${duel.life_machine}</td>
                <td class="text-center bg-octa-person text-primary-person fs-5">${duel.round}</td>
                <td class="text-center bg-octa-person text-primary-person fs-5">Continuar</td>
            </tr>`;
    }

    const tableHTML = `
        <div class="mt-5 pb-5 d-flex flex-column align-items-center bg-octa-person mb-5 w-100 table-responsive w-100 p-2">
            <table class="table table-striped table-hover bg-octa-person text-center">
                <h2 class="text-primary-person fs-1 py-2 text-center text-shadow-person">Partidas comenzadas</h2>
                <thead class="bg-octa-person text-primary-person fs-4">
                    <tr class="bg-octa-person text-primary-person fs-4">
                        <th class="text-center bg-octa-person text-primary-person fs-5">Vida usuario</th>
                        <th class="text-center bg-octa-person text-primary-person fs-5">Vida máquina</th>
                        <th class="text-center bg-octa-person text-primary-person fs-5">Ronda</th>
                        <th class="text-center bg-octa-person text-primary-person fs-5">Partidas</th>
                    </tr>
                </thead>
                <tbody class="align-middle">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
    container.innerHTML = tableHTML;
};

buildLoader();
buildHeader();
buildFooter();
buildBody();
hideLoader();