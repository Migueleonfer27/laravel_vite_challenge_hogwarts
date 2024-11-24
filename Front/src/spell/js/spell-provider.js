import { getToken } from "../../../storage/tokenManager";

const getAllSpells = async () => {
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

const getStudentSpells = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/spell/student', {
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

const getSpellLearned = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/spell/learned', {
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

const deleteSpell = async (id) => {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }
    const url = `http://127.0.0.1:8000/api/spell/${id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}

const updateSpell = async (id, body) => {
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(body)
    };
    const url = `http://127.0.0.1:8000/api/spell/${id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
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

const learnSpell = async (spell_id) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        }
    }
    const url = `http://127.0.0.1:8000/api/spell/learn/${spell_id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}

const getSpellpendings = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/spell/pending', {
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

const approveSpellTeacher = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/spell/approve/${id}`, {
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

const rejectSpellTeacher = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/spell/reject/${id}`, {
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

const getPendingDumbledore = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/spell/pending/dumbledore', {
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

const approveSpellDumbledore = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/spell/validate/${id}`, {
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

const rejectSpellDumbledore = async (id) => {
    const response = await fetch(`http://127.0.0.1:8000/api/spell/invalidate/${id}`, {
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

const addExperience = async (id) => {
    const response =await fetch(`http://127.0.0.1:8000/api/spell/addExperience/${id}`, {
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