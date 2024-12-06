import { BASE_URL } from "../../parameters/parameters";
import {getToken} from "../../../storage/tokenManager";

// Cynthia
export function changePassword(email) {
    return fetch(`${BASE_URL}/api/email/changePassword`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Solo se envía el correo electrónico
    })
        .then((response) => response.json().then((data) => ({ response, data })))
        .then(({ response, data }) => {
            if (response.ok) {
                return {
                    response: 'ok',
                    text: 'Se ha enviado una nueva contraseña a tu correo electrónico.',
                };
            } else {
                return {
                    response: 'error',
                    text: data.error || 'Ha ocurrido un error al procesar tu solicitud.',
                };
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            return {
                response: 'error',
                text: 'Error de conexión. Por favor, intenta de nuevo más tarde.',
            };
        });
}



export async function updatePassword(password) {
    const token = getToken()
    let message = {};

    try {
        const response = await fetch(`${BASE_URL}/api/email/updatePassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                new_password: password,
            })
        });

        const data = await response.json();
        console.log('Response:', response);

        if (response.ok) {
            message = {
                response: 'ok',
                text: 'La contraseña ha sido cambiada exitosamente.'
            };
            console.log('Password changed successfully', data);
        } else {
            message = {
                response: 'error',
                text: data.error || 'Ha ocurrido un error al cambiar la contraseña.'
            };
        }
    } catch (error) {
        console.error('Error:', error);
        message = {
            response: 'error',
            text: 'Error de conexión. Por favor, intenta de nuevo más tarde.'
        };
    }

    // Devuelve el mensaje al final de la función
    return message;
}
