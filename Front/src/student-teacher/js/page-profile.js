import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {getToken, removeToken} from "../../../storage/tokenManager";
import {apiGetProfile, uploadImageS3, updateProfileImage} from "./provider-student-teacher";
import {buildLoader, hideLoader, showLoader} from "../../components/buildLoader";
import {handleLogout} from "../../auth/auth-provider";

// Cynthia

export const saveLocalStore = (user) => {
    localStorage.setItem('userProfile',JSON.stringify(user))
}

const buildBody = () => {
    const mainContent = document.querySelector('#main-container');
    mainContent.innerHTML = `
        <div id="profile-table"  class="bg-octa-person rounded border">
            <h2 class="text-primary-person fs-1 text-center bg-cuaternary-person pt-3 m-0 rounded">Perfil</h2>
            <div class="profile-section pt-3 d-flex flex-column align-items-center bg-octa-person border-bottom">
                <img id="profile-img" src="" alt="" class="rounded-circle border object-fit-contain" width="120" height="120">
                <label for="upload-image" class="btn w-sm-50 w-md-25 modify text-primary-person text-shadow-person my-3">Subir imagen</label>
                <input type="file" id="upload-image" class="d-none" accept="image/*">
            </div>
        
            <div class="profile-data w-100 p-3">
                  <div class="table-responsive">
                        <table class="table table-bordered bg-octa-person">
                              <tbody class="text-center align-middle">
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Nombre</th>
                                        <td class="bg-octa-person text-primary-person" id="user-name"></td>
                                  </tr>
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Email</th>
                                        <td class="bg-octa-person text-primary-person" id="user-email"></td>
                                  </tr>
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Nivel</th>
                                        <td class="bg-octa-person text-primary-person" id="user-level"></td>
                                  </tr>
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Experiencia</th>
                                        <td class="bg-octa-person text-primary-person" id="user-experience"></td>
                                  </tr>
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Casa</th>
                                        <td class="bg-octa-person text-primary-person" id="user-house"></td>
                                  </tr>
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Puntuación Casa</th>
                                        <td class="bg-octa-person text-primary-person" id="house-level"></td>
                                  </tr>
                                  <tr>
                                        <th class="text-center bg-octa-person text-primary-person fs-5">Asignaturas</th>
                                        <td class="bg-octa-person text-primary-person" id="user-subject"></td>
                                  </tr>
                              </tbody>
                        </table>
                  </div>
            </div>
        </div>
    `;
}

const loadProfile = () => {
    apiGetProfile(getToken()).then( response => {
        const user = response
        const nameElement = document.getElementById('user-name')
        const emailElement = document.getElementById('user-email')
        const levelElement = document.getElementById('user-level')
        const experienceElement = document.getElementById('user-experience')
        const houseElement = document.getElementById('user-house')
        const levelHouseElement = document.getElementById('house-level')
        const subjectsElement = document.getElementById('user-subject')
        const profileImg = document.getElementById('profile-img')
        const containerElement = document.getElementById('main-container')
        const body = document.getElementsByTagName('body')

        saveLocalStore(user.data)

        containerElement.classList.remove('d-none')

        let rolesUser = localStorage.getItem('roles')
        let roles = rolesUser.split(',')
        if(roles.includes('student')){
            body.item(0).classList.add('student-background')
        }else{
            body.item(0).classList.add('teacher-background')
        }

        const {name,email,level,experience,house,subjects, url_photo} = user.data

        nameElement.textContent = name
        emailElement.textContent = email
        levelElement.textContent = level
        experienceElement.textContent = experience
        houseElement.textContent = house.name
        levelHouseElement.textContent = house.points

        if(profileImg && url_photo){
            profileImg.src = url_photo
            localStorage.setItem('profileImage',url_photo)
        }

        subjectsElement.innerHTML = ""
        if(subjects && subjects.length > 0){
            subjects.forEach(subject => {
                subject = subject === 'potions' ? 'Pociones' : subject;
                subject = subject === 'spells' ? 'Hechizos' : subject;
                const li = document.createElement('li')
                li.textContent = subject
                subjectsElement.appendChild(li)
            })
        }else{
            subjectsElement.textContent = "No estás matriculado en ninguna asignatura"
        }

        document.getElementById('upload-image').addEventListener('change',(e)=>{
            const file = e.target.files[0]
            if(file){
                uploadImageS3(file).then((data) =>{
                    if(data && data.url){
                        const profileImg = document.getElementById('profile-img')
                        profileImg.src = data.url
                        localStorage.setItem('profileImage', data.url)
                        updateProfileImage(data.url)
                    }

                }).catch((error) => console.error("Error al subir la imagen:", error))
            }
        })

        hideLoader()
    })
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click', handleLogout)
    }
}

buildLoader()
buildHeader()
buildFooter()
showLogoutButton()
setupLogoutBtn()
buildBody()
loadProfile()