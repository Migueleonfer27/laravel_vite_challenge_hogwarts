import { getToken } from "../../../storage/tokenManager";

const getSpells = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/spell/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json()
    return data
}



const createSpell = async (body) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    }
    const url = `http://127.0.0.1:8000/api/spell/`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}


export {
    getSpells,
    createSpell
}