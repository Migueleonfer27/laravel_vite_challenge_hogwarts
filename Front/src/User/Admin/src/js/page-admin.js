//monica
import '../../../../scss/styles.scss';
import { apiGetUsers, apiUpdateUser } from './admin-provider';
import {getToken} from "../../../../../storage/tokenManager";

const tbody = document.getElementById('body-table');
const button = document.getElementById('btn-alumns');
const token = getToken();


const getUsers = async () => {

    const res = await apiGetUsers(token);
    console.log(res[0]);
    construirCabecera(res[0]);
    construirCuerpo(res);

}

getUsers()

const construirCabecera = (objeto) => {
    let cabecera = document.querySelector('#header');
    let tr = document.createElement('tr');
    for (let clave in objeto) {
        if (clave === 'id' || clave === 'password'|| clave === 'created_at' || clave === 'updated_at' || clave === 'user_id') {
            continue;
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
            if (clave === 'id' || clave === 'password'|| clave === 'created_at' || clave === 'updated_at' || clave === 'user_id') {
                continue;
            }
            let td = document.createElement('td');
            if (clave === 'role' ) {
                let input = document.createElement('input');
                input.value = user[clave];
                input.classList.add('form-control');
                input.id = clave
                input.disabled = true;
                td.appendChild(input);
            } else {
                let input = document.createElement('input');
                input.value = user[clave];
                input.classList.add('form-control');
                input.id = clave
                td.appendChild(input);
            }
            tr.appendChild(td);
        }


        let tdModificar = document.createElement('td');
        let botonModificar = document.createElement('button');
        botonModificar.id = 'modificar';
        botonModificar.classList.add('btn', 'btn-warning');
        botonModificar.textContent = 'Modificar';

        botonModificar.addEventListener('click', (event) => {
            let inputs = tr.querySelectorAll('input');

            let data = {};

            inputs.forEach(input => {
                data[input.id] = input.value;
            });

            apiUpdateUser(token, tr.id, data)
                .then(data => {
                    console.log(data);
                    if (data.success === true)
                        window.location.reload()
                })


            console.log(data);
        });

        tdModificar.appendChild(botonModificar);
        tr.appendChild(tdModificar);

        cuerpo.appendChild(tr);
    });
}



