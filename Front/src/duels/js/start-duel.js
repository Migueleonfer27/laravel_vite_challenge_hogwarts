import {buildLoader, showLoader, hideLoader} from "../../components/buildLoader";
import {buildHeader, showLogoutButton, hideLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {loadPage} from "../../js/router";

const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="row row-cols-1 g-4 justify-content-center">
            <div class="col d-flex justify-content-center">
                  <div id="starDuels" class="card card-uniform bg-octa-person border border-2 border-primary-person h-100">
                        <div id="starDuelsBody" class="card-body d-flex flex-column">
                              <h5 id="starDuelTitle" class="card-title text-primary-person text-shadow-person fs-1 mb-3">Simulación duelo</h5>
                              <p id="startDuelText" class="card-text text-primary-person text-shadow-person mb-3 fs-5">Lanza tus hechizos y domina los duelos mágicos</p>
                              <button id="duelsButton" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Luchar</button>
                        </div>
                  </div>
            </div>
        </div>
    `;

    const duelsButton = document.getElementById('duelsButton');
    if (duelsButton) {
        duelsButton.addEventListener('click', () => {
            loadPage(`/duels`)
        });
    }
}

buildLoader();
buildHeader();
buildFooter();
buildBody();
hideLoader();