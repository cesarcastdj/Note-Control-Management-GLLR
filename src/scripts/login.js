document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Guardar el token en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Redirigir según el rol
                if (data.user.role === 'admin') {
                    window.location.href = '/Admin-Control/Admin-home';
                } else if (data.user.role === 'student') {
                    window.location.href = '/Student-Control/Student-home';
                }
            } else {
                // Mostrar mensaje de error
                alert(data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });
}); 