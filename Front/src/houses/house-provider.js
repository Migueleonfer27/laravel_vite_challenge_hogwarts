import { getToken } from "../../storage/tokenManager";
import {showHouseModal} from "./page-house";
import {BASE_URL} from "../parameters/parameters";

// Miguel León Fernández
const getUserHouse = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/getHouse`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (data.success) {
            console.log("House asigned:", data.house);
            await showHouseModal(data.house);
        } else {
            console.error("Error:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

// Miguel León Fernández
const getHousePreferences = () => {
    const preferences = [];

    document.querySelectorAll('.dropzone').forEach((zone) => {
        const img = zone.querySelector('img');
        if (img) {
            const houseName = img.alt;
            preferences.push(houseName);
        }
    });

    return preferences;
};

export {
    getUserHouse,
    getHousePreferences,
}