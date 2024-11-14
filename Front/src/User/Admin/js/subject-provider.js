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
            'Authorization' : 'Bearer' + token
        },
        body:JSON.stringify({user_id: userId})
    }
    const url = 'http://127.0.0.1:8000/api/subjects/${subjectId}/assign-subject'
    const response = await fetch (url,option)
    return await response.json();
}

export const apiRemoveSubject = async (token,subjectId)=> {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer' + token
        }
    }
    const url = 'http://127.0.0.1:8000/api/subjects/${subjectId}/remove-subjec'
    const response = await fetch(url,option)
    return await response.json();
}

