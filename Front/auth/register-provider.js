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
                    console.log('Registro exitoso:', data);
                } else {
                    console.error('Error en el registro:', data.errors || data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        });
    }
};

// Miguel León Fernández
export const handleLogin = () => {
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
                    console.log('Inicio de sesión exitoso:', data);
                    localStorage.setItem('token', data.data.token);
                } else {
                    console.error('Error en el inicio de sesión:', data.errors || data.message);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        });
    }
};
