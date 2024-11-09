export async function updatePassword(email, password, messageDiv, loader)  {
    messageDiv.style.display = 'none';
    loader.style.display = 'block';

    try {
        const response = await fetch('http://127.0.0.1:8000/api/changePassword', {
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
            messageDiv.style.display = 'block';
            messageDiv.textContent = 'La contraseña ha sido cambiada exitosamente.';
            console.log('Password changed successfully', data);
        } else {
            messageDiv.style.display = 'block';
            messageDiv.textContent = data.error || 'Ha ocurrido un error al cambiar la contraseña.'
            console.error('Failed change:', data.error);
        }
    } catch (error) {
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo más tarde.';
        console.error('Error:', error);
    }finally {
        loader.style.display = 'none';
    }
};


