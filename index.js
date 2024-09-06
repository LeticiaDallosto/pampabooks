// Importar módulos
const express = require('express');
const userApp = require('./users');

// Criar aplicação express
const app = express();
const port = process.env.PORT;

// Importar rotas
const userRoutes = require('./users/routes/userRoutes');

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});