import { getToken } from "../../../storage/tokenManager";
import {BASE_URL} from "../../parameters/parameters";

// Mónica
const getAllSpells = async () => {
    const response = await fetch(`${BASE_URL}/api/spell/`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json()
    return data
}
//Monica
const getStudentSpells = async () => {
    const response = await fetch(`${BASE_URL}/api/spell/student`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    },
    )
    const data = await response.json()
    return data
}
//Monica
const getSpellLearned = async () => {
    const response = await fetch(`${BASE_URL}/api/spell/learned`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    },
    )

    const data = await response.json()
    return data
}
//Monica
const deleteSpell = async (id) => {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }
    const url = `${BASE_URL}/api/spell/${id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}
//Monica
const updateSpell = async (id, body) => {
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    };
    const url = `${BASE_URL}/api/spell/${id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}
//Monica
const createSpell = async (body) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    }
    const url = `${BASE_URL}/api/spell/`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}
//Monica
const learnSpell = async (spell_id) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }
    const url = `${BASE_URL}/api/spell/learn/${spell_id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}
//Monica
const getSpellpendings = async () => {
    const response = await fetch(`${BASE_URL}/api/spell/pending`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        },
    )
    const data = await response.json()
    return data
}
//Monica
const approveSpellTeacher = async (id) => {
    const response = await fetch(`${BASE_URL}/api/spell/approve/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        },
    )
    const data = await response.json()
    return data
}
//Monica
const rejectSpellTeacher = async (id) => {
    const response = await fetch(`${BASE_URL}/api/spell/reject/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        },
    )
    const data = await response.json()
    return data
}
//Monica
const getPendingDumbledore = async () => {
    const response = await fetch(`${BASE_URL}/api/spell/pending/dumbledore`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        },
    )
    const data = await response.json()
    return data
}
//Monica
const approveSpellDumbledore = async (id) => {
    const response = await fetch(`${BASE_URL}/api/spell/validate/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
        },
    )
    const data = await response.json()
    return data
}
//Monica
const rejectSpellDumbledore = async (id) => {
    const response = await fetch(`${BASE_URL}/api/spell/invalidate/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${getToken()}`,
                'Content-Type': 'application/json',
            },
            },
    )
    const data = await response.json()
    return data
}
//Monica
const addExperience = async (id) => {
    const response =await fetch(`${BASE_URL}/api/spell/addExperience/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        },
    )
    console.log(response)
    const data = await response.json()
    return data
}
//Monica
export {
    getAllSpells,
    getStudentSpells,
    getSpellLearned,
    deleteSpell,
    updateSpell,
    createSpell,
    learnSpell,
    getSpellpendings,
    approveSpellTeacher,
    rejectSpellTeacher,
    getPendingDumbledore,
    approveSpellDumbledore,
    rejectSpellDumbledore,
    addExperience
}