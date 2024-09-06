// Importar módulos
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Criar aplicação express
const app = express();

// Conectar ao banco de dados
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado ao mongoDB!');
    })
    .catch((err) => {
        console.log('Erro ao conectar ao mongoDB: ' + err);
    });

// Configurar a aplicação para receber JSON 
/* O Json é usado nas rotas */
app.use(express.json());

// Importar rotas
app.use(require('./routes/userRoutes'));

// Exportar a aplicação configurada
module.exports = app;





