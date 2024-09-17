document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, password })
    });
    const data = await response.json();
    const loginMessage = document.getElementById('message');
    if (response.ok) {
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        loginMessage.textContent = 'Login efetuado com sucesso!';
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1000);
    } else {
        loginMessage.textContent = data.message;
    }
});