import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {removeToken} from "../../../storage/tokenManager";

document.addEventListener('DOMContentLoaded', () => {
    const adminButton = document.getElementById('admin-button');
    if (adminButton) {
        adminButton.addEventListener('click', () => {
            window.location.href ='../../User/Admin/admin-user.html';
        });
    }


    const manageSubjectsButton = document.getElementById('manage-subjects-button');
    if (manageSubjectsButton) {
        manageSubjectsButton.addEventListener('click', () => {
            window.location.href = '../../User/Admin/admin-subject.html';
        });
    }

    buildHeader();
    showLogoutButton()
    setupLogoutBtn()
    buildFooter();
});

const logout = () => {
    removeToken()
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click',logout)
    }
}
