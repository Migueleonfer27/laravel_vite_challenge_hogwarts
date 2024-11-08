export const addPasswordEvent = () => {
    const form = document.getElementById('change-password-form');
    const messageDiv = document.getElementById('message')
    const loader = document.getElementById('loader');


    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

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
                    messageDiv.style.color = 'green';
                    messageDiv.textContent = 'La contraseña ha sido cambiada exitosamente.';
                    console.log('Password changed successfully', data);
                } else {
                    messageDiv.style.display = 'block';
                    messageDiv.style.color = 'red';
                    messageDiv.textContent = data.error || 'Ha ocurrido un error al cambiar la contraseña.'
                    console.error('Failed change:', data.error);
                }
            } catch (error) {
                messageDiv.style.display = 'block';
                messageDiv.style.color = 'red';
                messageDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo más tarde.';
                console.error('Error:', error);
            }finally {
                loader.style.display = 'none';
            }
        });
    }
};


