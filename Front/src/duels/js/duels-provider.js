import {getToken} from "../../../storage/tokenManager";
import {BASE_URL} from "../../parameters/parameters";

//Cynthia
export const apiCreateDuel = async () => {
    const token = getToken();
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }
    const url = `${BASE_URL}/api/duels/create`;
    const response = await fetch(url, options);
    return response.json()
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
    const url = `${BASE_URL}/api/duels/getActiveDuels`;
    const response = await fetch(url, options);
    if (response.ok) {
        return await response.json()
    } else {
        return [];
    }
}

export const apiGetDuelById = async (id) => {
    const token = getToken()
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    const url = `${BASE_URL}/api/duels/get/${id}`;
    const response = await fetch(url, options);
    if (response.ok) {
        return await response.json()
    } else {
        return [];
    }
}

export const apiCastSpells = async (selectedSpell, duelModel) => {
    const token = getToken();
    const data = {
        userSpell: selectedSpell,
        duel: duelModel
    }
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    }
    const url = `${BASE_URL}/api/duels/castSpells`;
    const response = await fetch(url,options);
    return await response.json()
}


export const apiGetDuelStatistics = async () => {
    const token = getToken()
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    }
    const url = `${BASE_URL}/api/duels/statistics`;
    const response = await fetch(url,options)

    if(response.ok){
        return await response.json()
    }else{
        return {
            success: false,
            message: 'Error fetching duel statistics',
            statistics: {
                total_duels: 0,
                won_duels: 0,
                lost_duels: 0,
                active_duels: 0,
            }
        }
    }
}
