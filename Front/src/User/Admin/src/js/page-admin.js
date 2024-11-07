const table = document.querySelector('.table');
const tbody = document.querySelector('.table tbody');


const addUser = () => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.textContent = 'User 1';
    tr.appendChild(td);
    tbody.appendChild(tr);
}

