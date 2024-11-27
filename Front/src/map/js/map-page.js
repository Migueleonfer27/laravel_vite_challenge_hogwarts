import * as bootstrap from 'bootstrap';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {getNameStudent} from "../js/map-provider";

const getName = async () => {
    let data = await getNameStudent()
    let names = data.map(student => student.name)
    console.log(names)
    return names
}

const createMap = async () => {
    const mapElement = document.getElementById('mapMerodeador');
    const rows = 7;
    const cols = 8;
    const names = await getName().then(names => names.sort(() => Math.random() - 0.5)); //hacer el aleatorio
    const playersInMap = [];
    const playersNotInMap = [...names]; //crea copia para modificar el array de nombres

    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        row.className = 'text-primary-person ';
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.style.border = '1px solid white';
            cell.className = 'text-center bg-octa-person';
            cell.style.width = '90vh';
            if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
                cell.textContent = '####';
            }
            row.appendChild(cell);
        }
        mapElement.appendChild(row);
    }

    const playerCount = Math.floor(Math.random() * 5);
    for (let i = 0; i < playerCount; i++) {
        const randomRow = Math.floor(Math.random() * (rows - 2)) + 1;
        const randomCol = Math.floor(Math.random() * (cols - 2)) + 1;
        const cell = mapElement.rows[randomRow].cells[randomCol];
        const playerName = names[i] || 'Player';
        cell.textContent = playerName;
        playersInMap.push(playerName);
        const index = playersNotInMap.indexOf(playerName);
        if (index > -1) {
            playersNotInMap.splice(index, 1);
        }
    }

    console.log('Players in map:', playersInMap);
    console.log('Players not in map:', playersNotInMap);
}

const addDoor = (positions) => {
    const mapElement = document.getElementById('mapMerodeador');
    console.log(positions)
    positions.forEach(([row, col]) => {
        const cell = mapElement.rows[row]?.cells[col];
        if (cell) {
            cell.textContent = 'puerta';
        }
    });
};

await getName()
await createMap()
addDoor([[1, 0],[6,2], [0,5], [4,7]]);


buildHeader()
showLogoutButton()
buildFooter()
