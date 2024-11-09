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
        method: 'POST',
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

export {
    apiGetUsers,
    apiUpdateUser
};




