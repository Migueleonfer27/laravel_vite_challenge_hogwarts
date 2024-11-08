import {setToken} from "../../../../../storage/tokenManager";


export async function getDataFromAPI() {
    try {
        const getUsuario = 'https://reqres.in/api/users'
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}