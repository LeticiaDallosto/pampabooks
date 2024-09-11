document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const idUser = document.getElementById('enConsult').value;
    const url = `http://localhost:3000/users/${idUser}`;
    const user = document.getElementById('enUser').value;
    const password = document.getElementById('enPassword').value;
    const auth = 'Basic ' + window.btoa(user + ':' + password);
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': auth,
            'Content-Type':'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro: Usuário não localizado!');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('saConsulta').textContent = JSON.
        stringify(data,null,2);
        })
        .catch(erro => {
            document.getElementById('saConsulta').textContent = erro.message;
        });
    });