//Monica
const apiGetUsers = async (token) => {

        const option = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
        const url = 'http://127.0.0.1:8000/api/admin/users'
        const response = await fetch(url, option);

        const data = await response.json();
        return data

}

const apiUpdateUser = async (token, id, body) => {
    const option = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    };
    const url = `http://127.0.0.1:8000/api/admin/user/${id}`
    const response = await fetch(url, option);
    const data = await response.json();
    return data;
}

const apiGetRoles = async (token) => {
    const option = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    const url = 'http://127.0.0.1:8000/api/admin/role'
    const response = await fetch(url, option);
    return await response.json();
}

const apiDeleteRole = async (token, userID, roleID) => {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({role_id: roleID})
    }
    const url = `http://127.0.0.1:8000/api/admin/user-rol/${userID}`
    const response = await fetch(url, option);
    return await response.json();
}

const apiAddRole = async (token, userID, roleID) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({role_id: roleID})
    }
    const url = `http://127.0.0.1:8000/api/admin/user-rol/${userID}`
    const response = await fetch(url, option);
    return await response.json();
}

const apiDeleteUser = async (token, id) => {
    const option = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }
    const url = `http://127.0.0.1:8000/api/admin/user/${id}`
    const response = await fetch(url, option);
    return await response.json();
}

const apiCreateUser = async (token, body) => {
    const option = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(body)
    }
    const url = `http://127.0.0.1:8000/api/admin/user`
    const response = await fetch(url, option);
    return await response.json();
}

export {
    apiGetUsers,
    apiUpdateUser,
    apiGetRoles,
    apiDeleteRole,
    apiAddRole,
    apiDeleteUser,
    apiCreateUser,
};




