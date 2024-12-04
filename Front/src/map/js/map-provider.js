import {getToken} from "../../../storage/tokenManager";

//Monica
const doSimulation = async (id, seconds) => {
    const response = await fetch(`http://127.0.0.1:8000/api/admin/simulation/${id}/${seconds}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json()
    return data
}

export{
    doSimulation
}