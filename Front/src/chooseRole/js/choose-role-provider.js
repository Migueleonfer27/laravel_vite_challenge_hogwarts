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
    const data = await response.json();
    return data;
}

export {
    apiGetRoles };