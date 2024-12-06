import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import { loadPage} from "../../js/router";
import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";
import {handleLogout} from "../../auth/auth-provider";

// Cynthia
// Pequeña modificación Miguel

const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div class="row row-cols-1 g-4 justify-content-center">
            <div class="col d-flex justify-content-center">
                <div class="card card-uniform bg-octa-person border border-2 border-primary-person h-100 w-75">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary-person text-shadow-person fs-1 mb-3">Gestión de perfil</h5>
                        <p class="card-text text-primary-person text-shadow-person mb-3 fs-5">Gestiona tu perfil y mira tus estadísticas</p>
                        <button id="profileButton" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Mi Perfil</button>
                    </div>
                </div>
            </div>
            <div class="col d-flex justify-content-center">
                <div class="card card-uniform bg-octa-person border border-2 border-primary-person h-100 w-75">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary-person text-shadow-person fs-1 mb-3">Clase de hechizos</h5>
                        <p class="card-text text-primary-person text-shadow-person mb-3 fs-5">Un hechizo para cada propósito, magia para cada ocasión</p>
                        <button id="subject-spell" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Ir a clase</button>
                    </div>
                </div>
            </div>
            <div class="col d-flex justify-content-center">
                <div class="card card-uniform bg-octa-person border border-2 border-primary-person h-100 w-75">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary-person text-shadow-person fs-1 mb-3">Clase de pócimas</h5>
                        <p class="card-text text-primary-person text-shadow-person mb-3 fs-5">Pócimas para cada necesidad, magia líquida en cada gota</p>
                        <button id="subject-potion" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Ir a clase</button>
                    </div>
                </div>
            </div>
            <div class="col d-flex justify-content-center">
                <div class="card card-uniform bg-octa-person border border-2 border-primary-person h-100 w-75">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-primary-person text-shadow-person fs-1 mb-3">Práctica duelo</h5>
                        <p class="card-text text-primary-person text-shadow-person mb-3 fs-5">Perfecciona tu arte, domina la magia</p>
                        <button id="duels-button" class="btn mt-auto w-100 modify text-primary-person text-shadow-person fs-5">Duelo</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

const initPage = () => {
    let rolesUser = localStorage.getItem('roles')
    let roles = rolesUser.split(',')

    const body = document.getElementsByTagName('body')
    if(roles.includes('student')){
        body.item(0).classList.add('student-background')
    }else{
        body.item(0).classList.add('teacher-background')
    }

    const profileButton = document.getElementById('profileButton');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            loadPage(`/student-teacher-profile`)
        });
    }

    const subjectSpellButton = document.getElementById('subject-spell');
    if (subjectSpellButton) {
        subjectSpellButton.addEventListener('click', () => {
            if (roles.includes('student')) {
                loadPage('/student-subject-spell');
            } else {
                loadPage('/teacher-subject-spell');
            }
        });
    }

    const subjectPotionButton = document.getElementById('subject-potion');
    if (subjectPotionButton) {
        subjectPotionButton.addEventListener('click', () => {
            if (roles.includes('student')) {
                loadPage('/student-subject-potion');
            } else {
                loadPage('/teacher-subject-potion');
            }
        });
    }

    const duelsButton = document.getElementById('duels-button');
    if (duelsButton) {
        duelsButton.addEventListener('click', () => {
            loadPage('/start-duels')
        });
    }

    hideLoader(null, 600)
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click', handleLogout)
    }
}

// Miguel León Fernández
const availableSubjects = () => {
    const spellBtn = document.getElementById('subject-spell');
    const potionBtn = document.getElementById('subject-potion');

    if (!localStorage.getItem('subjects').includes('spells')) {
        spellBtn.setAttribute('disabled', 'disabled');
        spellBtn.classList.add('border-0');
    }
    if (!localStorage.getItem('subjects').includes('potions')) {
        potionBtn.setAttribute('disabled', 'disabled');
        potionBtn.classList.add('border-0');
    }
}

buildLoader();
showLoader();
buildHeader();
showLogoutButton();
setupLogoutBtn();
buildFooter();
buildBody();
initPage();
availableSubjects();