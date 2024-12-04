import * as bootstrap from 'bootstrap';
import {buildHeader, showLogoutButton} from "../../components/buildHeader";
import {buildFooter} from "../../components/buildFooter";
import {validationSeconds, validationEmpty} from "./validation";
import {doSimulation} from "./map-provider";

const mapID = 1
const simulateBtn = document.getElementById('simulateBtn');
simulateBtn.addEventListener('click', () => {
  const valueInput = document.getElementById('seconds').value;

    if (validationSeconds() && validationEmpty()) {
        const seconds = parseInt(valueInput);

        const data = doSimulation(mapID, seconds)
        data.then((response) => {
            console.log(response);
            const mapData = response[1];
            const table = document.getElementById('mapMerodeador');
            table.innerHTML = ''; // Clear any existing content

            for (let y = 1; y <= 7; y++) {
                const row = document.createElement('tr');
                for (let x = 1; x <= 8; x++) {
                    const cell = document.createElement('td');
                    const cellData = mapData.find(item => item.posicion_x === x && item.posicion_y === y);
                    cell.textContent = cellData ? cellData.content : '';

                    row.appendChild(cell);
                }
                table.appendChild(row);
            }
        });

    }


})




buildHeader()
showLogoutButton()
buildFooter()
