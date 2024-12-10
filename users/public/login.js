document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    localStorage.clear();

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, name, password })
    });
    const data = await response.json();
    const loginMessage = document.getElementById('message');
    if (response.ok) {
        loginMessage.textContent = 'Login efetuado com sucesso!';
        setTimeout(() => {
            window.location.href = 'http://localhost:3003?token='+ encodeURIComponent(data.accessToken);
        }, 1000);
    } else {
        loginMessage.textContent = data.message;
    }
});