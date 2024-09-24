// Importar módulos
const express = require('express');
const userApp = require('./users');
const catalogApp = require('./catalog');
const orderApp = require('./orders');

// Criar aplicação express
const app = express();
const port = process.env.PORT || 3000;

// Configurar a aplicação para receber JSON
app.use(express.json());

// Usar as rotas do módulo users
app.use('/users', userApp);

// Usar as rotas do módulo catalog
app.use('/catalog', catalogApp);

// Usar as rotas do módulo orders
app.use('/orders', orderApp);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor geral rodando em http://localhost:${port}`);
});