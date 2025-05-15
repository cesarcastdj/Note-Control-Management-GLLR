document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    const loginModal = document.querySelector('#loginModal');
    const emailInput = document.querySelector('#email');
    const passwordInput = document.querySelector('#password');
    const errorDiv = document.querySelector('.error-login');
    const errorMessage = document.querySelector('#error-login-message');

    // Función para mostrar error
    const showError = (message) => {
        if (errorDiv && errorMessage) {
            errorMessage.textContent = message;
            errorDiv.style.display = 'flex';
        }
    };

    // Función para ocultar error
    const hideError = () => {
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    };

    // Función para limpiar los campos
    const clearFields = () => {
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        hideError();
    };

    // Función para resetear el formulario
    const resetForm = () => {
        loginForm.reset();
        clearFields();
        hideError();
    };

    // Limpiar campos cuando se abre el modal
    loginModal.addEventListener('shown.bs.modal', clearFields);

    // Resetear el formulario cuando se cierra el modal
    loginModal.addEventListener('hidden.bs.modal', resetForm);

    // Validación en tiempo real
    emailInput.addEventListener('input', () => {
        hideError();
    });

    passwordInput.addEventListener('input', () => {
        hideError();
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Validación básica
        if (!email || !password) {
            showError('Por favor complete todos los campos');
            return;
        }

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

                // Resetear el formulario antes de redirigir
                resetForm();

                // Cerrar el modal
                const modalInstance = bootstrap.Modal.getInstance(loginModal);
                modalInstance.hide();

                // Redirigir según el rol
                if (data.user.role === 'admin') {
                    window.location.href = '/Admin-Control/Admin-home';
                } else if (data.user.role === 'student') {
                    window.location.href = '/Student-Control/Student-home';
                }
            } else {
                showError(data.message || 'Usuario o contraseña incorrectos');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Error al conectar con el servidor');
        }
    });
}); 