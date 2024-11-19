import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {getToken, removeToken} from "../../../storage/tokenManager";
import {apiGetProfile} from "./provider-student";



const token = getToken()
const nameElement = document.getElementById('user-name')
const emailElement = document.getElementById('user-email')
const levelElement = document.getElementById('user-level')
const experienceElement = document.getElementById('user-experience')
const houseElement = document.getElementById('user-house')
const levelHouseElement = document.getElementById('house-level')
const subjectsElement = document.getElementById('user-subject')


let rolesUser = localStorage.getItem('roles')
let roles = rolesUser.split(',')

const containerElement = document.getElementById('main-container')
const user = await apiGetProfile(token)

console.log(roles)

if(roles.includes('student')){
    containerElement.classList.add('student-background')
}else{
    containerElement.classList.add('teacher-background')
}
const saveLocalStore = (user) => {
    localStorage.setItem('userProfile',JSON.stringify(user))
}

const {name,email,level,experience,house,subjects} = user.data

nameElement.textContent = name
emailElement.textContent = email
levelElement.textContent = level
experienceElement.textContent = experience
houseElement.textContent = house.name
levelHouseElement.textContent = house.points

subjectsElement.innerHTML = ""
if(subjects && subjects.length > 0){
    subjects.forEach(subject => {
        const li = document.createElement('li')
        li.textContent = subject
        subjectsElement.appendChild(li)
    })
    }else{
    subjectsElement.textContent = "No estás matriculado en ninguna asignatura"
}

document.getElementById('upload-image').addEventListener('change',function(e){
    const file = e.target.files[0]
    if(file){
        const reader = new FileReader()
        reader.onload = function(e){
            const profileImg = document.getElementById('profile-img')
            profileImg.src = e.target.result
        }
        reader.readAsDataURL(file)
    }
})

const logout = () => {
    removeToken()
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click',logout)
    }
}

buildHeader();
showLogoutButton()
setupLogoutBtn()
buildFooter();
saveLocalStore(user.data)

