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


const tbody = document.getElementById('body-table');
const button = document.getElementById('btn-alumns');
const token = getToken();
const rolesModal = new bootstrap.Modal(document.getElementById('rolesModal'));
const addUsersBtn = document.querySelector('#btn-students')
const createUserBtn = document.querySelector('#modal-create-user')

addUsersBtn.addEventListener('click', () => {
        const addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'))
        addUserModal.show()
})

createUserBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#name-modal');
    const email = document.querySelector('#email-modal');
    const password = document.querySelector('#password-modal');
    const errorMessage = document.querySelector('#email-error-message'); // Un mensaje de error debajo del campo email

    if (validateForm([name, email, password]) && validateEmail(email.value) && validatePassword(password.value)) {
            const data = {
                name: name.value,
                email: email.value,
                password: password.value
            };

            try {
                await apiCreateUser(token, data)
                    .then(data =>{
                        console.log(data);
                        if (data.success){
                            window.location.reload()
                        }else {
                            console.log(data);
                            email.classList.add('is-invalid');
                            if (data.email[0] === 'the email already exists'){
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

const validateEmail = (email) => {
    let isValid = validations.validateEmail(email);
    if (!isValid) {
        document.querySelector('#email-modal').classList.add('is-invalid');
    } else {
        document.querySelector('#email-modal').classList.remove('is-invalid');
    }
    return isValid;
}

const validatePassword = (password) => {
    let isValid = validations.validatePassword(password);
    if (!isValid) {
        document.querySelector('#password-modal').classList.add('is-invalid');
    } else {
        document.querySelector('#password-modal').classList.remove('is-invalid');
    }
    return isValid;
}


document.getElementById('rolesModal').addEventListener('hidden.bs.modal', () => {
    location.reload();
});


const getUsers = async () => {
    const res = await apiGetUsers(token);
    console.log(res[0]);
    construirCabecera(res[0]);
    construirCuerpo(res);

}

const construirCabecera = (objeto) => {
    let cabecera = document.querySelector('#header');
    let tr = document.createElement('tr');
    for (let clave in objeto) {
        if (clave === 'id' || clave === 'password' || clave === 'created_at' || clave === 'updated_at' || clave === 'email_verified_at' || clave === 'roles') {
            continue;
        }
        if (clave === 'name') {
            clave = 'nombre';
        }
        if (clave === 'email') {
            clave = 'correo electrónico';
        }
        let th = document.createElement('th');
        th.textContent = clave;
        tr.appendChild(th);
    }
    cabecera.appendChild(tr);
}

const construirCuerpo = (users) => {
    let cuerpo = document.querySelector('#body');

    users.forEach(user => {
        let tr = document.createElement('tr');
        tr.id = user.id;
        for (let clave in user) {
            if (clave === 'id' || clave === 'password' || clave === 'created_at' || clave === 'updated_at' || clave === 'email_verified_at' || clave === 'roles') {
                continue;
            }
            let td = document.createElement('td');
            if (clave === 'role') {
                let input = document.createElement('input');
                input.value = user[clave];
                input.classList.add('form-control');
                input.id = clave
                input.disabled = true;
                td.appendChild(input);
            } else {
                let input = document.createElement('input');
                input.value = user[clave];
                input.classList.add('form-disabled');
                input.classList.add('form-control');
                input.id = clave
                input.disabled = true;
                td.appendChild(input);
            }
            tr.appendChild(td);
        }


        let tdBotones = document.createElement('td');
        tdBotones.width = '30%';

        let botonModificar = document.createElement('button');
        botonModificar.id = 'modificar';
        botonModificar.classList.add('btn' ,'me-2');
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
        botonRoles.classList.add('btn');
        botonRoles.textContent = 'Roles';

        botonRoles.addEventListener('click', (event) => {
            const rolesModal = new bootstrap.Modal(document.getElementById('rolesModal'))
            let userRoles = user.roles
            rolesModal.show()

            apiGetRoles(token)
                .then(roles=>{
                    construirModalRoles(roles, userRoles, user.id)
                })
        })

        tdBotones.appendChild(botonRoles);

        let botonEliminar = document.createElement('button');
        botonEliminar.id = 'eliminar';
        botonEliminar.classList.add('btn','ms-2');
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
        cuerpo.appendChild(tr);
    });
}

const construirModalRoles = (roles, rolesUser, userID) => {
    let modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = ''; // Clear previous content


    roles.forEach(role => {
        let div = document.createElement('div');
        div.classList.add('form-check');

        let button = document.createElement('button');
        button.classList.add('btn', 'm-2');
        let isRoleAssigned = rolesUser.some(userRole => userRole.name === role.name);
        button.textContent = isRoleAssigned ? `Eliminar rol (${role.name})` : `Añadir rol (${role.name})`;
        button.value = role.id;
        button.id = role.name;
        button.classList.add(isRoleAssigned ? 'btn-custom-danger' : 'btn-');

        button.addEventListener('click', async (event) => {
            if (button.textContent.includes('Eliminar rol')) {
                const data = await apiDeleteRole(token, userID, role.id);
                console.log(data);
                if (data.success) {
                    button.textContent = `Añadir rol (${role.name})`;
                    // button.classList.add('btn');
                    button.classList.remove('btn-custom-danger');
                }
            } else if (button.textContent.includes('Añadir rol')) {
                const data = await apiAddRole(token, userID, role.id);
                console.log(data);
                if (data.success) {
                    button.textContent = `Eliminar rol (${role.name})`;
                    button.classList.add('btn-custom-danger');
                }
            }
        });

        div.appendChild(button);
        modalBody.appendChild(div);
    });
}

const logout = () => {
    removeToken()
}

const setupLogoutBtn = () => {
    const logoutButton = document.getElementById('logoutBtn')
    if(logoutButton){
        logoutButton.addEventListener('click',logout)
    }
}

getUsers()

buildHeader()
showLogoutButton()
setupLogoutBtn()
buildFooter()
