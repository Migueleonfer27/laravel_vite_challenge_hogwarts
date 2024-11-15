// Importaciones necesarias
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import { getToken } from "../../../../storage/tokenManager";
import { apiGetUsers } from "./admin-provider";
import { apiGetUserSubjects, apiGetSubjects, apiAssignSubject, apiRemoveSubject } from "./subject-provider";
import { buildHeader, showLogoutButton } from "../../../components/buildHeader";
import { buildFooter } from "../../../components/buildFooter";

// Referencias globales
const userTable = document.getElementById("body-user-table");
const token = getToken();
const addSubjectModal = new bootstrap.Modal(document.getElementById('addSubjectModal'));
const subjectSelectModal = document.getElementById('subject-select-modal');
const addSubjectForm = document.getElementById('addSubjectForm');
const removeSubjectModal = new bootstrap.Modal(document.getElementById('removeSubjectModal'));
const removeMessageContainer = document.getElementById('remove-message-container');
const removeSubjectSelect = document.getElementById('remove-subject-select');

let selectedUserId = null;  // Variable para almacenar el ID del usuario seleccionado

// Función para llenar el select con asignaturas disponibles
const populateSubjectSelect = async (selectElement) => {
    try {
        const subjects = await apiGetSubjects(token); // Obtener las asignaturas disponibles
        selectElement.innerHTML = ""; // Limpia el select de asignaturas previas

        if (subjects.length === 0) {
            const option = document.createElement("option");
            option.disabled = true;
            option.textContent = "No hay asignaturas disponibles";
            selectElement.appendChild(option);
        } else {
            subjects.forEach(subject => {
                const option = document.createElement("option");
                option.value = subject.id;
                option.textContent = subject.name;
                selectElement.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar las asignaturas", error);
    }
};

// Función para llenar el select con las asignaturas del usuario
const populateUserSubjectsSelect = async (userId) => {
    try {
        // Obtener las asignaturas del usuario
        const userSubjects = await apiGetUserSubjects(token, userId);

        // Obtener el select para las asignaturas
        const selectElement = document.getElementById('remove-subject-select');
        selectElement.innerHTML = ""; // Limpiar el select de asignaturas previas

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
// Función para asignar una asignatura
const assignSubject = async (event) => {
    event.preventDefault(); // Previene la recarga de la página al enviar el formulario

    const selectedSubjectId = subjectSelectModal.value; // Obtiene el ID de la asignatura seleccionada
    if (!selectedSubjectId) {
        alert("Por favor, selecciona una asignatura válida.");
        return;
    }

    try {
        await apiAssignSubject(token, selectedSubjectId, selectedUserId); // Aquí pasamos el ID de la asignatura y el usuario
        const messageContainer = document.getElementById('assign-message');
        messageContainer.classList.remove('d-none');
        messageContainer.classList.add('alert-success');
        messageContainer.textContent = "Asignatura añadida correctamente";  // Mensaje de éxito
        setTimeout(() => {
            addSubjectModal.hide();
        }, 2000);
    } catch (error) {
        const messageContainer = document.getElementById('assign-message');
        messageContainer.classList.remove('d-none');
        messageContainer.classList.add('alert-danger');
        messageContainer.textContent = "Hubo un error al asignar la asignatura.";  // Mensaje de error
    }
};

// Función para eliminar la asignatura
const confirmRemoveSubject = async () => {
    const selectedSubjectId = removeSubjectSelect.value;

    if (!selectedSubjectId) {
        removeMessageContainer.classList.remove('d-none');
        removeMessageContainer.classList.add('alert-warning');
        removeMessageContainer.textContent = "Por favor, selecciona una asignatura a eliminar."; // Mensaje de advertencia
        return;
    }

    try {
        await apiRemoveSubject(token, selectedSubjectId); // Eliminar asignatura
        removeMessageContainer.classList.remove('d-none');
        removeMessageContainer.classList.add('alert-success');
        removeMessageContainer.textContent = "Asignatura eliminada correctamente.";  // Mensaje de éxito
        setTimeout(() => {
            removeSubjectModal.hide();
        }, 2000);
    } catch (error) {
        removeMessageContainer.classList.remove('d-none');
        removeMessageContainer.classList.add('alert-danger');
        removeMessageContainer.textContent = "Hubo un error al eliminar la asignatura.";  // Mensaje de error
    }
};

// Carga usuarios con sus acciones
const loadUserByRole = async () => {
    try {
        const users = await apiGetUsers(token);

        users.forEach(user => {
            const tr = document.createElement("tr");
            tr.setAttribute("data-user-id", user.id);  // Guardar el ID del usuario en un atributo de la fila

            const tdName = document.createElement("td");
            tdName.textContent = user.name;

            const tdEmail = document.createElement("td");
            tdEmail.textContent = user.email;

            const tdRol = document.createElement("td");
            const rol = user.roles.find(rol => rol.name === 'teacher' || rol.name === 'student');
            tdRol.textContent = rol ? (rol.name === 'teacher' ? 'Profesor' : 'Estudiante') : '';

            const tdActions = document.createElement("td");

            // Crear los botones de acción dentro del ciclo para cada usuario
            const addBtn = document.createElement("button");
            addBtn.classList.add("btn", "btn-primary", "me-2");
            addBtn.textContent = "Añadir asignatura";
            addBtn.addEventListener('click', async (event) => {
                const userRow = event.target.closest('tr');  // Encontrar la fila más cercana al botón
                selectedUserId = userRow.getAttribute('data-user-id');  // Obtener el ID del usuario desde un atributo 'data-user-id'

                if (!selectedUserId) {
                    alert("No se ha seleccionado un usuario válido.");
                    return;
                }

                await populateSubjectSelect(subjectSelectModal);  // Llena el select con las asignaturas
                addSubjectModal.show();  // Abre el modal de añadir asignatura
            });

            const removeBtn = document.createElement("button");
            removeBtn.classList.add("btn", "btn-danger", "me-2");
            removeBtn.textContent = "Eliminar asignatura";
            removeBtn.addEventListener('click', async (event) => {
                const userRow = event.target.closest('tr');  // Encontrar la fila más cercana al botón
                selectedUserId = userRow.getAttribute('data-user-id');  // Obtener el ID del usuario desde un atributo 'data-user-id'

                if (!selectedUserId) {
                    alert("No se ha seleccionado un usuario válido.");
                    return;
                }

                // Llamar a la función para llenar el select con las asignaturas del usuario
                await populateUserSubjectsSelect(selectedUserId);  // Llena el select con las asignaturas del usuario
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

// Inicialización
buildHeader();
buildFooter();
showLogoutButton();
await loadUserByRole();

// Añadir evento para el botón de confirmación de eliminación
document.getElementById('confirmRemoveBtn').addEventListener('click', confirmRemoveSubject);

// Añadir evento para el formulario de asignación
addSubjectForm.addEventListener('submit', assignSubject);
