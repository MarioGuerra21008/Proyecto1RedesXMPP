document.getElementById('registerBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();
        document.getElementById('output').textContent = result.message;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Error al registrar.';
    }
});
