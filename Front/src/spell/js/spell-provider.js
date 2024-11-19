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
    const response = await fetch('http://127.0.0.1:8000/api/spell/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    return data
}


export {
    getSpells
}