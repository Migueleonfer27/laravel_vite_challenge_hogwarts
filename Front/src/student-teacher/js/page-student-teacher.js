import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import { loadPage} from "../../js/router";
import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";
import {handleLogout} from "../../auth/auth-provider";

// Cynthia
// Pequeña modificación Miguel

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
            //window.location.href = '../../User/Admin/admin-subject.html';
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

buildLoader()
showLoader()
buildHeader();
showLogoutButton()
setupLogoutBtn()
buildFooter();
initPage()
availableSubjects()