import { getToken } from "../../storage/tokenManager";

// Miguel León Fernández
export const getHouse = async (userId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Selected house fetched successfully:", data.house);
            return data.house;
        } else {
            console.error("Failed to fetch selected house:", data.errors || data.message);
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

// Miguel León Fernández
export const submitHousePreferences = async (userId) => {
    const preferences = getHousePreferences();

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ preferences }),
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Preferences submitted successfully:", data);
        } else {
            console.error("Failed to submit preferences:", data.errors || data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};