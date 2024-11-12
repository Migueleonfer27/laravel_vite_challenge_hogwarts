import { setToken, removeToken, getToken } from "../../storage/tokenManager";
import { toggleAuthButtons } from "./page-auth";
import { showMessageError, showSuccessMessage } from "./page-auth";
import { getHousePreferences } from "../houses/house-provider";

// Miguel León Fernández
export const handleRegister = () => {
    const form = document.getElementById('registerForm');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('nameUser').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm_password = document.getElementById('confirmPassword').value;
            const housePreferences = getHousePreferences();
            const noPreference = document.getElementById('noPreference').checked;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, confirm_password, housePreferences, noPreference })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('User registered successfully', data);
                    showSuccessMessage("Registro completado exitosamente.");
                    form.reset();
                } else {
                    showMessageError(response.status, data.errors || { general: [data.message] });
                    console.error('Register failed:', data.errors || data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                showMessageError(500, { general: ['Error de conexión.'] });
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
                    localStorage.setItem('name', data.data.name);
                    toggleAuthButtons(true);
                    callback();
                } else {
                    console.error('Login failed:', data.errors);
                    showMessageError(response.status, data.errors);
                }
            } catch (error) {
                console.error('Error:', error);
                showMessageError(500, { general: ['Error de conexión.'] });
            }
        });
    }
};

//Miguel León Fernández
export async function handleLogout() {
    localStorage.removeItem('name');

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