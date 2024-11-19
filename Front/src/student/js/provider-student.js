import {getToken} from "../../../storage/tokenManager";

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

export const uploadImageS3 = async (file) => {
    const token = getToken()
    const formData = new FormData()
    formData.append('image', file)

    const option = {
        method : 'POST',
        headers : {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    }
    const url = `http://127.0.0.1:8000/api/subirs3`
    const response = await fetch(url,option);
    return await response.json()
}

export const updateProfileImage = async (imageUrl) =>{
    const token = getToken()

    const option = {
        method : 'PUT',
        headers : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({profile_image: imageUrl})
    }

    const url = `http://127.0.0.1:8000/updateimage`
    const response = await fetch(url,option)
    return await response.json()

}