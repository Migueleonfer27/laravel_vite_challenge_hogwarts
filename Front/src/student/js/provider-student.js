export const  apiGetProfile = async (token) =>{
    const option = {
        method : 'GET',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    const url = `http://127.0.0.1:8000/api/user/profile`
    const response = await fetch(url, option);
    return await response.json();
}