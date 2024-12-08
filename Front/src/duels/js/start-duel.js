import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";
import {buildHeader} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {loadPage} from "../../js/router";
import {apiCreateDuel, apiGetActiveDuels, apiGetDuelStatistics} from "./duels-provider";
import {showToastMessages} from "../../js/messages";

const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="row g-4 justify-content-center align-items-stretch">
            <div class="col-12 col-md-6 d-flex">
                <div id="starDuels" class="card card-uniform bg-octa-person border border-2 border-primary-person d-flex flex-column flex-fill">
                    <div id="starDuelsBody" class="card-body d-flex flex-column flex-grow-1">
                        <h5 id="starDuelTitle" class="card-title text-primary-person fs-1 py-2 text-center text-shadow-person">Simulación duelo</h5>
                        <p id="startDuelText" class="card-text text-primary-person text-shadow-person mb-3 fs-5">Lanza tus hechizos y domina los duelos mágicos</p>
                        <button id="duelsButton" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Luchar</button>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 d-flex">
                <div id="statistics" class="card card-uniform bg-octa-person border border-2 border-primary-person d-flex flex-column flex-fill">
                    <div id="statisticsBody" class="card-body d-flex flex-column flex-grow-1">
                        <h5 id="statisticsTitle" class="card-title text-primary-person fs-1 py-2 text-center text-shadow-person">Estadísticas</h5>
                        <p id="statisticsText" class="card-text text-primary-person text-shadow-person mb-3 fs-5">Revisa tus estadísticas y mejora tus habilidades</p>
                        <button id="statisticsButton" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Ver estadísticas</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="startedDuelsContainer"></div>
        
        <div class="modal fade" id="statisticsModal" tabindex="-1" aria-labelledby="statisticsModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-cuaternary-person">
                    <div class="modal-header">
                        <h5 class="modal-title text-primary-person" id="statisticsModalLabel">Estadísticas de Duelos</h5>
                        <<button type="button" class="btn-close bg-primary-person" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="statisticsModalContent" class="text-center text-primary-person">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const duelsButton = document.getElementById('duelsButton');
    if (duelsButton) {
        duelsButton.addEventListener('click', () => {
            showLoader();
            apiCreateDuel()
                .then(response => {
                    if(response.codError && response.codError === 100){
                        hideLoader()
                        showToastMessages("No tienes hechizos aprendidos para realizar un duelo")
                    }else{
                        localStorage.setItem('duelId', response.data.id) // guardo la información para pasarlo de una ventana a otra
                        loadPage(`/duels`)
                    }
                })
                .catch(error => {
                    console.error(error)
                    hideLoader()
                    showToastMessages('Error')
                })
        });
    }

    apiGetActiveDuels().then( response => {
        displayStartedDuels(response.activeDuels)
        hideLoader()
    })

    const statisticsButton = document.getElementById('statisticsButton');
    if (statisticsButton) {
        statisticsButton.addEventListener('click', () => {
            showLoader();
            apiGetDuelStatistics()
                .then(response => {
                    hideLoader();
                    showStatisticsModal(response);
                    const modalElement = document.getElementById('statisticsModal');
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                })
                .catch(error => {
                    hideLoader();
                    showToastMessages('Error al obtener estadísticas');

                    //con los valores a 0
                    showStatisticsModal({
                        statistics: {
                            total_duels: 0,
                            won_duels: 0,
                            lost_duels: 0,
                            active_duels: 0,
                        }
                })
                    const modalElement = document.getElementById('statisticsModal');
                    const modal = new bootstrap.Modal(modalElement);
                    modal.show();
                })
        })
    }
}

const displayStartedDuels = (duels) => {
    const container = document.getElementById('startedDuelsContainer');

    if(!duels || duels.length === 0){
        container.innerHTML = `
            <div class="col text-center text-primary-person bg-octa-person fs-5 mt-5 p-4 bg-dark">
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
                <td class="text-center bg-octa-person text-primary-person fs-5">
                    <button class="btnContinueDuel btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5" value="${duel.id}">Continuar</button>
                </td>
            </tr>`;
    }

    container.innerHTML = `
        <div class="mt-5 pb-5 d-flex flex-column align-items-center bg-octa-person mb-5 w-100 table-responsive w-100 p-2">
            <table class="table table-striped table-hover bg-octa-person text-center">
                <h2 class="text-primary-person fs-1 py-2 text-center text-shadow-person">Partidas comenzadas</h2>
                <thead class="bg-octa-person text-primary-person fs-4">
                    <tr class="bg-octa-person text-primary-person fs-4">
                        <th class="text-center bg-octa-person text-primary-person fs-5">Vida usuario</th>
                        <th class="text-center bg-octa-person text-primary-person fs-5">Vida máquina</th>
                        <th class="text-center bg-octa-person text-primary-person fs-5">Ronda</th>
                        <th class="text-center bg-octa-person text-primary-person fs-5"></th>
                    </tr>
                </thead>
                <tbody class="align-middle">
                    ${rows}
                </tbody>
            </table>
        </div>
    `;

    // Añade los eventos a los botones de continuar los duelos empezados
    const btnsContinueDuels = document.querySelectorAll('.btnContinueDuel')
    btnsContinueDuels.forEach(btn => {
        btn.addEventListener('click', e => {
            const duelId = e.target.getAttribute('value')
            const duel = duels.find(duel => duel.id === parseInt(duelId))
            const JSONDuel = JSON.stringify(duel)
            localStorage.setItem('duelId', duelId);
            loadPage('/duels')
        })
    })
};

//Datos del modal
const showStatisticsModal = (statistics) => {
    const modalContent = document.getElementById('statisticsModalContent');
    modalContent.innerHTML = `
        <p class="fs-5">Total de duelos: ${statistics.statistics.total_duels}</p>
        <p class="fs-5">Duelos ganados: ${statistics.statistics.won_duels}</p>
        <p class="fs-5">Duelos perdidos: ${statistics.statistics.lost_duels}</p>
        <p class="fs-5">Duelos activos: ${statistics.statistics.active_duels}</p>
    `;
}

buildLoader();
buildHeader();
buildFooter();
buildBody();