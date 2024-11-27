import {getToken} from "../../../storage/tokenManager";

//Monica
const getNameStudent = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/admin/nameStudent', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    })

    const data = await response.json()
    return data
}

export{
    getNameStudent
}