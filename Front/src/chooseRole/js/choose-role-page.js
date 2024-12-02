import '../../scss/styles.scss';
// import {apiGetRoles } from './choose-role-provider';
// import {handleLogout} from "../../auth/auth-provider";
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {loadPage} from "../../js/router";
import {removeToken} from "../../../storage/tokenManager";
import {getUserHouse} from "./choose-role-provider";
import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";
import {handleLogout} from "../../auth/auth-provider";

// Mónica

let houseUser = async () =>{
    let res = await getUserHouse()
    //console.log(house)
    return res
}

const imgHouse = (house) => {
    let img = document.querySelector('#img-house')
    img.className = 'house-badge object-fit-contain'

    if (house === 'Gryffindor') {
        img.src = '../../assets/img/gryffindor.png'
    }else if (house === 'Hufflepuff') {
        img.src = '../../assets/img/hufflepuff.png'
    }else if (house === 'Ravenclaw'){
        img.src = '../../assets/img/ravenclaw.png'
    }else if (house === 'Slytherin'){
        img.src = '../../assets/img/slytherin.png'
    }
}


let rolesUser = localStorage.getItem('roles')
let roles = rolesUser.split(',')
console.log(roles)

const construirCard = (house) => {
    let construirDiv = document.querySelector('#role-container');

    construirDiv.innerHTML = '';

    roles.forEach((role) => {
        let card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('class', house)
        let contentContainer = document.querySelector('#content-container')
        contentContainer.className = `container-div ${house} d-flex align-items-center justify-content-center flex-column w-100 p-3`;
        //console.log(house)

        let cardIcon = document.createElement('div');
        cardIcon.className = 'card-icon';
        cardIcon.innerHTML = '';
        if (role === 'admin') {
            cardIcon.innerHTML =`
                <i class="bi bi-person-workspace"></i>
            `;
        }else if (role === 'teacher') {
            cardIcon.innerHTML =`
                <i class="bi bi-highlighter"></i>
            `;
        }else if (role === 'student-teacher') {
            cardIcon.innerHTML =`
                <i class="bi bi-eyeglasses"></i>
            `;
        }else {
            cardIcon.innerHTML =`
               <i class="bi bi-feather"></i>
            `;
        }

        let cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        let cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        if (role === 'admin') {
            cardTitle.innerText = 'Admin';
        }else if (role === 'teacher') {
            cardTitle.innerText = 'Profesor';
        }else if (role === 'student') {
            cardTitle.innerText = 'Estudiante';
        }else {
            cardTitle.innerText = role;
        }

        let cardLink = document.createElement('a');
        cardLink.className = 'btn';
        cardLink.innerText = cardTitle.innerText;
        if (role === 'admin') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/admin');
            })
        }else if (role === 'teacher') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/student-teacher')
            })
        }else if (role === 'student') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/student-teacher');
            })
        }else if (role === 'dumbledore') {
            cardLink.addEventListener('click', (e) => {
                e.preventDefault();
                loadPage('/dumbledore');
            })
        }else {
            cardTitle.innerText = role;
        }

        cardBody.appendChild(cardIcon);

        cardBody.appendChild(cardLink);

        card.appendChild(cardBody);
        document.getElementById('role-container').appendChild(card);
    })
    hideLoader(null, 600)
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click', handleLogout)
    }
}


buildLoader()
showLoader()
buildHeader()
showLogoutButton()
buildFooter()
setupLogoutBtn()

const house = await houseUser()
imgHouse(house)
construirCard(house)
