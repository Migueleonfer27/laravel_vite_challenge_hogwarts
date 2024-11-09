import { setToken, removeToken, getToken } from "../../storage/tokenManager";
import { toggleAuthButtons } from "./page-auth";
import { showMessageError } from "./page-auth";

// Miguel León Fernández
export const handleRegister = () => {
    const form = document.getElementById('registerForm');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('User register in successfully', data);
                } else {
                    showMessageError(data.error);
                    console.error('Register failed:', data.error);
                }
            } catch (error) {
                showMessageError(error);
                console.error('Error:', error);
            }
        });
    }
};

// Miguel León Fernández
export const handleLogin = (callback) => {
    const form = document.getElementById('loginForm');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('User logged in successfully', data);
                    setToken(data.data.token);
                    toggleAuthButtons(true);
                    callback();
                } else {
                    console.error('Login failed:', data.error);
                    showMessageError(data.error);
                }
            } catch (error) {
                showMessageError(error);
                console.error('Error:', error);
            }
        });
    }
};

//Miguel León Fernández
export async function handleLogout() {
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