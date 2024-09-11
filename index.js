// Importar módulos
const express = require('express');
const userApp = require('./users');
const path = require('path');

// Criar aplicação express
const app = express();
const port = process.env.PORT || 3000;

// Configurar a aplicação para receber JSON
app.use(express.json());

// Usar as rotas do módulo users
app.use('/users', userApp);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});