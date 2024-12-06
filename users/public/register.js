document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, password, isAdmin: false })
    });
    const data = await response.json();
    const message = document.getElementById('message');
    if (response.ok) {
        message.textContent = 'Usuário registrado com sucesso! Faça login.';
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    } else {
        message.textContent = data.message;
    }
});