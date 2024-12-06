import {getToken} from "../../../storage/tokenManager";
import {BASE_URL} from "../../parameters/parameters";

// Mónica
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
            //console.log("House asigned:", data.house);

            return data.house;
        } else {
            console.error("Error:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};


export {
    getUserHouse
};