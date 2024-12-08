import * as bootstrap from 'bootstrap';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {validationSeconds, validationEmpty} from "./validation";
import {doSimulation} from "./map-provider";

const mapID = 1;
const simulateBtn = document.getElementById('simulateBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentSecondDisplay = document.getElementById('currentSecond');

let currentSecond = 0;
let maps = [];

simulateBtn.addEventListener('click', () => {
    const valueInput = document.getElementById('seconds').value;

    if (validationSeconds() && validationEmpty()) {
        const seconds = parseInt(valueInput);
        console.log('seconds:', seconds); // Debugging: log seconds

        const data = doSimulation(mapID, seconds);
        data.then((response) => {
            console.log(response);
            maps = response.map;
            currentSecond = 0;
            updateMap(maps[currentSecond]);
            currentSecondDisplay.textContent = currentSecond;
        });
    }
});

const updateMap = (mapData) => {
    const table = document.getElementById('mapMerodeador');
    table.innerHTML = ''; // Clear any existing content

    console.log('mapData:', mapData); // Debugging: log mapData

    for (let y = 1; y <= 7; y++) {
        const row = document.createElement('tr');
        for (let x = 1; x <= 8; x++) {
            const cell = document.createElement('td');
            const cellData = mapData
                .filter(item => item.posicion_x === x && item.posicion_y === y)
                .find(item => item.content !== null) || { content: '' };
            console.log(`cellData for x=${x}, y=${y}:`, cellData); // Debugging: log cellData
            cell.innerHTML = cellData.content; // Use innerHTML to render content

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
};

prevBtn.addEventListener('click', () => {
    if (currentSecond > 0) {
        currentSecond--;
        updateMap(maps[currentSecond]);
        currentSecondDisplay.textContent = currentSecond;
    }
});

nextBtn.addEventListener('click', () => {
    if (currentSecond < maps.length - 1) {
        currentSecond++;
        updateMap(maps[currentSecond]);
        currentSecondDisplay.textContent = currentSecond;
    }
});

buildHeader();
showLogoutButton();
buildFooter();