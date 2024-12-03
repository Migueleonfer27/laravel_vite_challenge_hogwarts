import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import {buildFooter} from "../../../components/buildFooter";
import {removeToken} from "../../../../storage/tokenManager";
import {buildLoader, hideLoader, showLoader} from "../../../components/buildLoader";
import {loadPage} from "../../../js/router";

// Cynthia
// Pequeño aporte Miguel

const initPage = () => {
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href = '../../user/admin/admin-user.html';
        });
    }

    // Miguel León Fernández
    const profileButton = document.getElementById('profileButton');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            window.location.href = '../../student-teacher/profile.html';
        })
    }

    const manageSubjectsButton = document.getElementById('manage-subjects-button');
    if (manageSubjectsButton) {
        manageSubjectsButton.addEventListener('click', () => {
            window.location.href = '../../user/admin/admin-subject.html';
        });
    }

    const spellButton = document.getElementById('spell-button');
    if (spellButton) {
        spellButton.addEventListener('click', () => {
            window.location.href ='../../../spell/index.html'
        });
    }


    const potionsButton = document.getElementById('potions-button');
    if (potionsButton) {
        potionsButton.addEventListener('click', () => {
            window.location.href ='../../../potions/potions.html'
        });
    }


    hideLoader(null, 600)

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

// Miguel León Fernández
const hideDivsAdmin = () => {
    const divPotion = document.getElementById('admin-potion-container');
    const divSpell = document.getElementById('admin-spell-container');

    if (localStorage.getItem('roles').includes('admin')) {
        divPotion.classList.add('d-none');
        divSpell.classList.add('d-none');
    }
}

buildLoader()
showLoader()
buildHeader();
showLogoutButton()
setupLogoutBtn()
buildFooter()
initPage()
hideDivsAdmin()