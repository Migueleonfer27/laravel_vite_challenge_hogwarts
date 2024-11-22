import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import {getToken, removeToken} from "../../../../storage/tokenManager";
import { apiGetUsers } from "./admin-provider";
import { apiGetUserSubjects, apiGetSubjects, apiAssignSubject, apiRemoveSubject,apiCreateSubject } from "./subject-provider";
import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import { buildFooter } from "../../../components/buildFooter";
import {showToastMessages} from "../../../js/messages";

const userTable = document.getElementById("body-user-table");
const token = getToken();
const addSubjectModal = new bootstrap.Modal(document.getElementById('addSubjectModal'));
const subjectSelectModal = document.getElementById('subject-select-modal');
const addSubjectForm = document.getElementById('addSubjectForm');
const removeSubjectModal = new bootstrap.Modal(document.getElementById('removeSubjectModal'));
const removeMessageContainer = document.getElementById('remove-message-container');
const removeSubjectSelect = document.getElementById('remove-subject-select');
const createSubjectModal = new bootstrap.Modal(document.getElementById('Create'))
const createSubjectForm = document.getElementById('createSubjectForm')
const createSubjectMessage = document.getElementById('create-subject-message')

let selectedUserId = null;


document.getElementById('btn-subject').addEventListener('click', () => {
    createSubjectModal.show()
})

const populateSubjectSelect = async (selectElement, userId) => {
    try {
        const allSubjects = await apiGetSubjects(token);
        const userSubjects = await apiGetUserSubjects(token, userId);


        const unassignedSubjects = allSubjects.filter(subject =>
            !userSubjects.some(userSubject => userSubject.id === subject.id)
        );

        selectElement.innerHTML = "";

        if (unassignedSubjects.length === 0) {
            const option = document.createElement("option");
            option.disabled = true;
            option.textContent = "No hay asignaturas disponibles para asignar";
            selectElement.appendChild(option);
        } else {
            unassignedSubjects.forEach(subject => {
                const option = document.createElement("option");
                option.value = subject.id;
                option.textContent = subject.name;
                selectElement.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar las asignaturas", error);
        selectElement.innerHTML = "";
        const option = document.createElement("option");
        option.disabled = true;
        option.textContent = "Hubo un error al cargar las asignaturas";
        selectElement.appendChild(option);
    }
};

const populateUserSubjectsSelect = async (userId) => {
    try {
        const userSubjects = await apiGetUserSubjects(token, userId);

        const selectElement = document.getElementById('remove-subject-select');
        selectElement.innerHTML = "";

        if (userSubjects.length === 0) {
            const option = document.createElement("option");
            option.disabled = true;
            option.textContent = "Este usuario no tiene asignaturas asignadas";
            selectElement.appendChild(option);
        } else {
            userSubjects.forEach(subject => {
                const option = document.createElement("option");
                option.value = subject.id;
                option.textContent = subject.name;
                selectElement.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar las asignaturas del usuario:", error);
        const selectElement = document.getElementById('remove-subject-select');
        selectElement.innerHTML = "";
        const option = document.createElement("option");
        option.disabled = true;
        option.textContent = "Hubo un error al cargar las asignaturas";
        selectElement.appendChild(option);
    }
};

const assignSubject = async (event) => {
    event.preventDefault();
    const selectedSubjectId = subjectSelectModal.value;

    if (!selectedSubjectId) {
        showToastMessages("Por favor, selecciona una asignatura válida.",false);
        return;
    }

    try {
        await apiAssignSubject(token, selectedSubjectId, selectedUserId);
        const messageContainer = document.getElementById('assign-message');
        messageContainer.classList.remove('d-none');
        messageContainer.classList.add('alert-success');
        messageContainer.textContent = "Asignatura añadida correctamente";
        setTimeout(() => {
            addSubjectModal.hide();
            addSubjectForm.reset();
        }, 1000);
    } catch (error) {
        const messageContainer = document.getElementById('assign-message');
        messageContainer.classList.remove('d-none');
        messageContainer.classList.add('alert-danger');
        messageContainer.textContent = "Hubo un error al asignar la asignatura.";
    }
};

const confirmRemoveSubject = async () => {
    const selectedSubjectId = removeSubjectSelect.value;

    if (!selectedSubjectId) {
        removeMessageContainer.classList.remove('d-none');
        removeMessageContainer.classList.add('alert-warning');
        removeMessageContainer.textContent = "Por favor, selecciona una asignatura a eliminar.";
        return;
    }

    try {
        await apiRemoveSubject(token, selectedSubjectId);
        removeMessageContainer.classList.remove('d-none');
        removeMessageContainer.classList.add('alert-success');
        removeMessageContainer.textContent = "Asignatura eliminada correctamente.";
        setTimeout(() => {
            removeSubjectModal.hide();
        }, 1000);
    } catch (error) {
        removeMessageContainer.classList.remove('d-none');
        removeMessageContainer.classList.add('alert-danger');
        removeMessageContainer.textContent = "Hubo un error al eliminar la asignatura.";
    }
};

const createSubject = async (e) => {
    e.preventDefault();

    const subjectNameInput = document.getElementById('subject-name-input');
    const subjectName = subjectNameInput.value.trim();

    if (!subjectName) {
        createSubjectMessage.classList.remove('d-none', 'alert-warning', 'alert-danger');
        createSubjectMessage.classList.add('alert-warning');
        createSubjectMessage.textContent = 'Por favor, pon un nombre válido';
        return;
    }

    const response = await apiCreateSubject(token, subjectName);

    if (response.success) {
        createSubjectMessage.classList.remove('d-none', 'alert-warning', 'alert-danger');
        createSubjectMessage.classList.add('alert-success');
        createSubjectMessage.textContent = 'Asignatura creada correctamente';
        setTimeout(() => {
            createSubjectForm.reset();
            createSubjectModal.hide();
            createSubjectMessage.classList.add('d-none');
        }, 200);
    } else {
        createSubjectMessage.classList.remove('d-none', 'alert-warning', 'alert-success');
        createSubjectMessage.classList.add('alert-danger');
        createSubjectMessage.textContent = 'Error al crear la asignatura';
    }
};

const addBtnHandler = async (event) => {
    const userRow = event.target.closest('tr');
    selectedUserId = userRow.getAttribute('data-user-id');

    if (!selectedUserId) {
        showToastMessages("No se ha seleccionado un usuario válido.",false);
        return;
    }

    await populateSubjectSelect(subjectSelectModal, selectedUserId);
    addSubjectModal.show();
};

const loadUserByRole = async () => {
    try {
        const users = await apiGetUsers(token);

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-user-id", user.id);

            const tdName = document.createElement("td");
            tdName.textContent = user.name;


            const tdEmail = document.createElement("td");
            tdEmail.textContent = user.email;

            const tdRol = document.createElement("td");
            const rol = user.roles.find(rol => rol.name === 'teacher' || rol.name === 'student');
            tdRol.textContent = rol ? (rol.name === 'teacher' ? 'Profesor' : 'Estudiante') : '';

            const tdActions = document.createElement("td");

            const addBtn = document.createElement("button");
            addBtn.classList.add("btn", "w-100", "modify","text-primary-person", "text-shadow-person");
            addBtn.textContent = "Añadir asignatura";
            addBtn.addEventListener('click', addBtnHandler);

            const removeBtn = document.createElement("button");
            removeBtn.classList.add("btn", "w-100", "modify","text-primary-person", "text-shadow-person");
            removeBtn.textContent = "Eliminar asignatura";
            removeBtn.addEventListener('click', async (event) => {
                const userRow = event.target.closest('tr');
                selectedUserId = userRow.getAttribute('data-user-id');

                if (!selectedUserId) {
                    showToastMessages("No se ha seleccionado un usuario válido.",false);
                    return;
                }

                await populateUserSubjectsSelect(selectedUserId);
                removeSubjectModal.show();
            });

            tdActions.appendChild(addBtn);
            tdActions.appendChild(removeBtn);

            tr.appendChild(tdName);
            tr.appendChild(tdEmail);
            tr.appendChild(tdRol);
            tr.appendChild(tdActions);

            if (user.roles.some(rol => rol.name === 'teacher') || user.roles.some(rol => rol.name === 'student')) {
                userTable.appendChild(tr);
            }
        });
    } catch (error) {
        console.error("Error al cargar los usuarios", error);
    }
};

const logout = () => {
    removeToken();
};

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
};

buildHeader();
buildFooter();
showLogoutButton();
setupLogoutBtn();
await loadUserByRole();

addSubjectForm.addEventListener('submit', assignSubject);
document.getElementById('remove-subject-confirm-btn').addEventListener('click', confirmRemoveSubject);
createSubjectForm.addEventListener('submit', createSubject);