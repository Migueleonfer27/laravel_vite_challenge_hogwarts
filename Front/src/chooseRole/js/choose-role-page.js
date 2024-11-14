import '../../scss/styles.scss';
import {apiGetRoles } from './choose-role-provider';
import {handleLogout} from "../../auth/auth-provider";

import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import { loadPage } from "../../js/router";
import {removeToken} from "../../../storage/tokenManager";

let rolesUser = localStorage.getItem('roles')
let roles = rolesUser.split(',')
console.log(roles)

const construirRoles = () => {
    let construirDiv = document.querySelector('#role-container');
    construirDiv.innerHTML = '';

    roles.forEach((role) => {
        let card = document.createElement('div');
        card.className = 'card';

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        if (role === 'admin') {
            cardTitle.innerText = 'Administrador';
        }else if (role === 'teacher') {
            cardTitle.innerText = 'Profesor';
        }else if (role === 'student') {
            cardTitle.innerText = 'Estudiante';
        }else {
            cardTitle.innerText = role;
        }


        let cardLink = document.createElement('a');
        cardLink.className = 'btn';
        cardLink.innerText = 'Seleccionar';
        if (role === 'admin') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/admin');
            })
        }else if (role === 'teacher') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/teacher');
            })
        }else if (role === 'student') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/student');
            })
        }else {
            cardTitle.innerText = role;
        }


        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardLink);


        card.appendChild(cardBody);

        // Append card to the desired container
        document.getElementById('role-container').appendChild(card);
    })

}
//TODO: Implementar la función de cerrar sesión
const logout = () => {
    removeToken()
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click',logout)
    }
}

buildHeader()
showLogoutButton()
buildFooter()
setupLogoutBtn()
construirRoles()