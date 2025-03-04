//monica
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import {
    apiAddRole,
    apiCreateUser,
    apiDeleteRole,
    apiDeleteUser,
    apiGetRoles,
    apiGetUsers,
    apiUpdateUser
} from './admin-provider';
import * as validations from './validations';
import {getToken, removeToken} from "../../../../storage/tokenManager";
import {buildHeader, showLogoutButton} from "../../../components/buildHeader";
import {buildFooter} from "../../../components/buildFooter";
import {buildLoader, hideLoader, showLoader} from "../../../components/buildLoader";
import modal from "bootstrap/js/src/modal";
import {handleLogout} from "../../../auth/auth-provider";

// Mónica
// Cynthia
// Pequeña modificación Miguel

const initPage = () => {
const tbody = document.getElementById('body-table');
const button = document.getElementById('btn-alumns');
const token = getToken();
const rolesModal = new bootstrap.Modal(document.getElementById('rolesModal'));
const addUsersBtn = document.querySelector('#btn-students')
const createUserBtn = document.querySelector('#modal-create-user')

// let rolesUser = localStorage.getItem('roles')
// let roles = rolesUser.split(',')

//Monica
    addUsersBtn.addEventListener('click', () => {
        const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'))
        addUserModal.show()
    })
//Monica
    createUserBtn.addEventListener('click', async (e) => {
        e.preventDefault();


        const name = document.querySelector('#name-modal');
        const email = document.querySelector('#email-modal');
        const password = document.querySelector('#password-modal');
        const errorMessage = document.querySelector('#email-error-message');

        if (validateForm([name, email, password]) && validateEmail(email.value) && validatePassword(password.value)) {
            const data = {
                name: name.value,
                email: email.value,
                password: password.value
            };

            try {
                await apiCreateUser(token, data)
                    .then(data => {
                        console.log(data);
                        if (data.success) {
                            window.location.reload()
                        } else {
                            console.log(data);
                            email.classList.add('is-invalid');
                            if (data.email[0] === 'the email already exists') {
                                errorMessage.textContent = 'El correo electrónico ya está registrado. Intenta con otro.';
                            }
                            errorMessage.style.display = 'block';
                        }
                    })
            } catch (error) {
                console.error('Error al crear usuario:', error);
            }
        }
    });

//Monica
    const validateForm = (inputs) => {
        let isValid = true;
        inputs.forEach(input => {
            if (!validations.validateIsNotEmpty(input.value)) {
                isValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });
        return isValid;
    }

    //Monica
    const validateEmail = (email) => {
        let isValid = validations.validateEmail(email);
        if (!isValid) {
            document.querySelector('#email-modal').classList.add('is-invalid');
        } else {
            document.querySelector('#email-modal').classList.remove('is-invalid');
        }
        return isValid;
    }

    //Monica
    const validatePassword = (password) => {
        let isValid = validations.validatePassword(password);
        if (!isValid) {
            document.querySelector('#password-modal').classList.add('is-invalid');
        } else {
            document.querySelector('#password-modal').classList.remove('is-invalid');
        }
        return isValid;
    }

    //Monica
    document.getElementById('rolesModal').addEventListener('hidden.bs.modal', () => {
        location.reload();
    });
    //Monica
    const getUsers = async () => {
        const res = await apiGetUsers(token);
        construirCabecera(res[0]);
        construirCuerpo(res);
        hideLoader(null, 600)
    }
    //Monica
    const construirCabecera = (objeto) => {
        let cabecera = document.querySelector('#header');
        let tr = document.createElement('tr');
        for (let clave in objeto) {
            if (
                clave === 'id' ||
                clave === 'password' ||
                clave === 'created_at' ||
                clave === 'updated_at' ||
                clave === 'email_verified_at' ||
                clave === 'roles' ||
                clave === 'url_photo'
            ) {
                continue;
            }
            if (clave === 'name') {
                clave = 'nombre';
            }
            if (clave === 'level') {
                clave = 'nivel';
            }
            if (clave === 'experience') {
                clave = 'experiencia';
            }

            if (clave === 'id_house') {
                clave = 'casa';
            }


            let th = document.createElement('th');
            th.textContent = clave;
            tr.appendChild(th);
        }

        let accionesTh = document.createElement('th');
        accionesTh.textContent = 'acciones';
        tr.appendChild(accionesTh);

        cabecera.appendChild(tr);
    };

    //Monica
    const construirCuerpo = (users) => {
        let cuerpo = document.querySelector('#body');

        const currentUser = 'dumbledore';

        users.forEach(user => {
            let tr = document.createElement('tr');
            tr.id = user.id;
            for (let clave in user) {
                if (
                    clave === 'id' ||
                    clave === 'password' ||
                    clave === 'created_at' ||
                    clave === 'updated_at' ||
                    clave === 'email_verified_at' ||
                    clave === 'roles' ||
                    clave === 'url_photo'
                ) {
                    continue;
                }
                let td = document.createElement('td');
                td.classList.add('text-center', 'bg-octa-person', 'text-primary-person');

                if (clave === 'role') {
                    td.textContent = user[clave];
                    td.classList.add('fs-4');
                } else {
                    td.textContent = user[clave];
                }

                if (clave === 'id_house') {
                    if (user[clave] === 1) {
                        td.textContent = 'Slytherin';
                    } else if (user[clave] === 2) {
                        td.textContent = 'Hufflepuff';
                    } else if (user[clave] === 3) {
                        td.textContent = 'Ravenclaw';
                    } else if (user[clave] === 4) {
                        td.textContent = 'Gryffindor';
                    }
                }
                tr.appendChild(td);
            }

            let tdBotones = document.createElement('td');
            //tdBotones.width = '30%';

            let botonModificar = document.createElement('button');
            botonModificar.id = 'modificar';
            botonModificar.classList.add("btn", "w-100", "modify", "text-primary-person", "text-shadow-person");
            botonModificar.textContent = 'Modificar';

            botonModificar.addEventListener('click', (event) => {
                let updateModal = new bootstrap.Modal(document.getElementById('updateUserModal'));
                updateModal.show();

                let inputName = document.querySelector('#update-name-modal');
                let inputEmail = document.querySelector('#update-email-modal');

                inputName.value = user.name;
                inputEmail.value = user.email;

                const updateUserBtn = document.querySelector('#modal-update-user')
                updateUserBtn.addEventListener('click', async (e) => {
                    e.preventDefault()
                    let data = {
                        name: inputName.value,
                        email: inputEmail.value
                    }
                    if (validateForm([inputName, inputEmail]) && validateEmail(inputEmail.value)) {
                        console.log(data, tr.id);
                        apiUpdateUser(token, parseInt(tr.id), data)
                            .then(data => {
                                console.log(data);
                                if (data.success === true)
                                    window.location.reload()
                            })
                    }
                })

            });

            tdBotones.appendChild(botonModificar);

            let botonRoles = document.createElement('button');
            botonRoles.id = 'roles';
            botonRoles.classList.add("btn", "w-100", "modify", "text-primary-person", "text-shadow-person");
            botonRoles.textContent = 'Roles';

            botonRoles.addEventListener('click', (event) => {
                const rolesModal = new bootstrap.Modal(document.getElementById('rolesModal'))
                let userRoles = user.roles
                rolesModal.show()

                apiGetRoles(token)
                    .then(roles => {
                        construirModalRoles(roles, userRoles, user.id)
                    })
            })

            tdBotones.appendChild(botonRoles);

            let botonEliminar = document.createElement('button');
            botonEliminar.id = 'eliminar';
            botonEliminar.classList.add("btn", "w-100", "modify", "text-primary-person", "text-shadow-person");
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.addEventListener('click', (event) => {
                apiDeleteUser(token, user.id)
                    .then(data => {
                        console.log(data);
                        if (data.success === true)
                            window.location.reload()
                    })
            })
            tdBotones.appendChild(botonEliminar);

            tr.appendChild(tdBotones);
            if (user.name !== 'Dumbledore' && user.name !== localStorage.getItem('name'))
                cuerpo.appendChild(tr);
        });
    }

    //Monica
    const construirModalRoles = (roles, rolesUser, userID) => {
        let modalBody = document.querySelector('.modal-body');
        let modalError = document.querySelector('#roles-modal-error')
        modalBody.innerHTML = '';
        modalError.textContent = '';
        modalError.style.display = 'none';

        roles.forEach(role => {
            let div = document.createElement('div');
            div.classList.add('form-check');

            let button = document.createElement('button');
            button.classList.add("btn", "w-100", "modify", "text-primary-person", "text-shadow-person");
            let isRoleAssigned = rolesUser.some(userRole => userRole.name === role.name);
            button.textContent = isRoleAssigned ? `Eliminar rol (${role.name})` : `Añadir rol (${role.name})`;
            button.value = role.id;
            button.id = role.name;
            button.classList.add(isRoleAssigned ? 'btn-custom-danger' : 'btn-');

            button.addEventListener('click', async (event) => {
               const hasTeacherRole = rolesUser.some(userRole => userRole.name === 'teacher')
                const hasStudientRole = rolesUser.some(userRole => userRole.name === 'student')

                if(role.name === 'teacher' && hasStudientRole){
                    modalError.textContent = 'No puedes asignar el rol de profesor'
                    modalError.style.display = 'block'
                    return
                }

                if(role.name === 'student' && hasTeacherRole){
                    modalError.textContent = 'No puedes asignar el rol estudiante'
                    modalError.style.display = 'block'
                    return
                }

                if (button.textContent.includes('Eliminar rol')) {
                    const data = await apiDeleteRole(token, userID, role.id);
                    console.log(data);
                    if (data.success) {
                        button.textContent = `Añadir rol (${role.name})`;
                        // button.classList.add('btn');
                        button.classList.remove('btn-custom-danger');
                        rolesUser = rolesUser.filter(userRole => userRole.name !== role.name)
                    }
                } else if (button.textContent.includes('Añadir rol')) {
                    const data = await apiAddRole(token, userID, role.id);
                    if (data.success) {
                        button.textContent = `Eliminar rol (${role.name})`;
                        button.classList.add('btn-custom-danger');
                        rolesUser.push({ id: role.id, name: role.name });
                    }
                }
                modalError.style.display = 'none'
            });

            if (button.id !== 'dumbledore') {
                div.appendChild(button);
                modalBody.appendChild(div);
            }
        });
    }
    getUsers()
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
setupLogoutBtn()
buildFooter()
initPage()