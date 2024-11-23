import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import {buildFooter} from "../../../components/buildFooter";
import {removeToken} from "../../../../storage/tokenManager";
import {buildLoader, hideLoader, showLoader} from "../../../components/buildLoader";
import {loadPage} from "../../../js/router";


const initPage = () => {
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href = '../../user/admin/admin-user.html';
        });
    }


    const manageSubjectsButton = document.getElementById('manage-subjects-button');
    if (manageSubjectsButton) {
        manageSubjectsButton.addEventListener('click', () => {
            window.location.href = '../../user/admin/admin-subject.html';
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

buildLoader()
showLoader()
buildHeader();
showLogoutButton()
setupLogoutBtn()
buildFooter()
initPage()


