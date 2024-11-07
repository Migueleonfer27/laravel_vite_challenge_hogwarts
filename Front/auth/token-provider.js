import { setToken, removeToken, getToken } from "../storage/tokenManager";

// Miguel León Fernández
async function login(email, password) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            setToken(data.data.token);
            console.log('User logged in successfully', data);
            return data;
        } else {
            console.error('Login failed:', data.error);
            return null;
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Miguel León Fernández
async function logout() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (response.ok) {
            removeToken();
            console.log('User logged out successfully');
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}