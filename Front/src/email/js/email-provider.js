export const updatePassword = () => {
    const form = document.getElementById('change-password-form');

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://127.0.0.1:8000/api/changePassword', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Password changed successfully', data);
                } else {
                    console.error('Failed change:', data.error);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
};


