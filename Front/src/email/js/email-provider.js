export const addPasswordEvent = () => {
    const form = document.getElementById('change-password-form');
    console.log('Form:', form);

    if (form) {
        console.log('Adding submit event listener')
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submit prevented');

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            console.log('Email:', email);
            console.log('Password:', password);

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


