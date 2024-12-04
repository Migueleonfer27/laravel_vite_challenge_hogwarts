import {getToken} from "../../../storage/tokenManager";

//Cynthia
export const apiStartDuel = async () => {
    const token = getToken();
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }
    const url = `http://127.0.0.1:8000/api/duels/start`;
    const response = await fetch(url,options);
    return await response.json()
}

export const apiGetActiveDuels = async () => {
    const token = getToken()
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    const url = `http://127.0.0.1:8000/api/duels/active`;
    const response = await fetch(url,options);
    if(response.ok){
        return await response.json()
    }else{
        return [];
    }
}
