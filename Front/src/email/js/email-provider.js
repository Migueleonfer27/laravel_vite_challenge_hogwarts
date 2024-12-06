import {BASE_URL} from "../../parameters/parameters";

// Cynthia
export async function updatePassword(email, password)  {
    let message = {}

    try {
        const response = await fetch(`${BASE_URL}/api/changePassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                new_password: password,
            })
        });

        const data = await response.json();
        console.log('Response:', response);
        if (response.ok) {
            message = {
                response: 'ok',
                text: 'La contraseña ha sido cambiada exitosamente.'
            }
            console.log('Password changed successfully', data);
        } else {
            message = {
                response: 'error',
                text: data.error || 'Ha ocurrido un error al cambiar la contraseña.'
            }
            console.error('Failed change:', data.error);
        }
    } catch (error) {
        message = {
            response: 'error',
            text: 'Error de conexión. Por favor, intenta de nuevo más tarde.'
        }
        console.error('Error:', error);
    }

    return message;
};


