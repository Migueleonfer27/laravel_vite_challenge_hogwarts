import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {removeToken} from "../../../storage/tokenManager";
import { loadPage} from "../../js/router";
import {apiGetProfile} from "./provider-student-teacher";

let rolesUser = localStorage.getItem('roles')
let roles = rolesUser.split(',')

const containerElement = document.getElementById('main-container')

if(roles.includes('student-teacher')){
    containerElement.classList.add('student-teacher-background')
}else{
    containerElement.classList.add('teacher-background')
}

document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.getElementById('profileButton');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            loadPage(`/student-profile`)
        });
    }


    const subjectSpellButton = document.getElementById('subject-spell');
    if (subjectSpellButton) {
        subjectSpellButton.addEventListener('click', () => {
            // if(roles.includes('student-teacher')){
            //     loadPage('/student-teacher-subject-spell')
            // }else{
            //     loadPage('/teacher-subject-spell')
            // }
        });
    }

    const subjectPotionButton = document.getElementById('subject-potion');
    if (subjectPotionButton) {
        subjectPotionButton.addEventListener('click', () => {
            if (roles.includes('student-teacher')) {
                 loadPage('/student-teacher-subject-potion');
            } else {
                 loadPage('/teacher-subject-potion');
            }
        });
    }

    const duelsButton = document.getElementById('duels-button');
    if (duelsButton) {
        duelsButton.addEventListener('click', () => {
            //window.location.href = '../../User/Admin/admin-subject.html';
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
