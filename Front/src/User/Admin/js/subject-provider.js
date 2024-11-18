//Cynthia
export const apiGetSubjects = async (token) => {
    const option = {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer' + token
        }
    }
    const url = 'http://127.0.0.1:8000/api/subjects'
    const response = await fetch(url, option);
    return await response.json();
}

export const apiAssignSubject = async (token, subjectId, userId) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        },
        body: JSON.stringify({ user_id: userId })
    }
    const url = `http://127.0.0.1:8000/api/subjects/${subjectId}/assign-subject`
    const response = await fetch(url, option);
    return await response.json();
}

export const apiRemoveSubject = async (token,subjectId)=> {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${token}`
        }
    }
    const url = `http://127.0.0.1:8000/api/subjects/${subjectId}/remove-subject`
    const response = await fetch(url,option)
    return await response.json();
}
export const apiGetUserSubjects = async (token, userId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/user/${userId}/subjects`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener las asignaturas del usuario');
        }

        return await response.json();
    } catch (error) {
        console.error("Error al cargar las asignaturas del usuario:", error);
        throw error;
    }
}

export const apiCreateSubject = async (token,subjectName) =>{
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({name: subjectName}),
    }

    const url = `http://127.0.0.1:8000/api/subjects`
    const response = await fetch(url,options)
    return await response.json()
}








