import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import {getToken} from "../../../../storage/tokenManager";
import {apiGetUsers} from "./admin-provider";
import {apiGetRoles} from "./admin-provider";
import {apiAssignSubject, apiGetSubjects,apiRemoveSubject} from "./subject-provider";
import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import {buildFooter} from "../../../components/buildFooter";


const teacherTable = document.getElementById("body-teacher-table")
const studentTable = document.getElementById("body-student-table")
const token = getToken()


const loadUserByRole = async () => {

    try{
        const users  = await apiGetUsers(token)
        const roles = await apiGetRoles(token)

        users.forEach(user => {

            const tr = document.createElement("tr")
            const tdName = document.createElement("td")
            tdName.textContent = user.name;


            const tdEmail = document.createElement("td")
            tdEmail.textContent = user.email;

            const tdActions = document.createElement("td")

            const addBtn = document.createElement("button");
            addBtn.classList.add("btn", "btn-primary", "me-2");
            addBtn.textContent = "Añadir asignatura";
            addBtn.addEventListener('click', async () => {
                const subjects = await apiGetSubjects(token);
                const subjectData = prompt('Selecciona una asignatura:', subjects.map(subject => subject.name).join(", "));
                const selectedSubject = subjects.find(subject => subject.name === subjectData);
                if (selectedSubject) {
                await apiAssignSubject(token, user.id, selectedSubject.id);
                alert("Asignatura añadida correctamente");
            } else {
                alert("Asignatura no encontrada");
            }


        });
        tdActions.appendChild(addBtn);


        const removeBtn = document.createElement("button");
        removeBtn.classList.add("btn", "btn-danger", "me-2");
        removeBtn.textContent = "Eliminar asignatura";
        removeBtn.addEventListener('click', async () => {
            const subjects = await apiGetSubjects(token);
            const subjectData = prompt('Selecciona una asignatura a eliminar:', subjects.map(subject => subject.name).join(", "));
            const selectedSubject = subjects.find(subject => subject.name === subjectData);
            if (selectedSubject) {
                await apiRemoveSubject(token, selectedSubject.id);
                alert("Asignatura eliminada correctamente");
            } else {
                alert("Asignatura no encontrada");
            }

        });
        tdActions.appendChild(removeBtn);

        tr.appendChild(tdName)
        tr.appendChild(tdEmail)
        tr.appendChild(tdActions)



        if(user.roles.some(rol => rol.name === 'teacher')){
            teacherTable.appendChild(tr)
            console.log(tr)
        }else if(user.roles.some(rol => rol.name === 'student')){
            studentTable.appendChild(tr)
        }

        })
    }catch (error){
        console.error("Error al cargar los usuarios", error)
    }
}

const loadSubjects = async () => {
    try {
        const subjectSelectModify = document.getElementById('subject-modify-select-modal');
        const subjectSelectDelete = document.getElementById('subject-delete-select-modal');
        const subjects = await apiGetSubjects(token);


        subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            subjectSelectModify.appendChild(option.cloneNode(true));
            subjectSelectDelete.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las asignaturas", error)
    }
}

    buildHeader();
    buildFooter();
    showLogoutButton();
    await loadUserByRole();
    await loadSubjects();





