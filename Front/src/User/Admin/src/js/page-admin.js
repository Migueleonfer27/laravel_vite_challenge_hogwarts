//monica
import { getUsers } from './api.js';

const table = document.querySelector('.table');
const tbody = document.querySelector('.table tbody');

function createTable(getUsers) {
    tbody.innerHTML = ''; // Limpiar el contenido anterior

    getUsers.forEach(item => {
        const tr = document.createElement('tr');

        const idTd = document.createElement('td');
        idTd.textContent = item.id;
        tr.appendChild(idTd);

        const userTd = document.createElement('td');
        userTd.textContent = item.usuario;
        tr.appendChild(userTd);

        const emailTd = document.createElement('td');
        emailTd.textContent = item.correo;
        tr.appendChild(emailTd);

        tbody.appendChild(tr);
    });
}



