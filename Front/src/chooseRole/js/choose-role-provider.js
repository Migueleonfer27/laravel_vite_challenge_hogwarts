import {getToken} from "../../../storage/tokenManager";

//Monica
const getUserHouse = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/getHouse', {
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