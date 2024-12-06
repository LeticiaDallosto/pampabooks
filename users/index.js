// Importar módulos
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const path = require('path');

// Criar aplicação express
const app = express();
// const port = process.env.PORT || 3002;
const port = 3002;

// Configurar a aplicação para usar o body-parser
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Conectar ao banco de dados
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Users conectado ao mongoDB!');

        // Criar usuário administrador fixo
        const adminEmail = 'admin@example.com';
        const adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            const hashedPassword = await bcrypt.hash('adminpassword', 10);
            const newAdminUser = new User({
                name: 'Admin',
                email: adminEmail,
                password: hashedPassword,
                isAdmin: true
            });
            await newAdminUser.save();
            console.log('Usuário administrador criado com sucesso!');
        } else {
            console.log('Usuário administrador já existe.');
        }
    })
    .catch((err) => {
        console.log('Erro ao conectar ao mongoDB: ' + err);
    });
    
// Configurar a aplicação para receber JSON 
/* O Json é usado nas rotas */
app.use(express.json());

// Utilizar rotas importadas
app.use('/', userRoutes);

// Iniciar a aplicação na porta 3002
app.listen(port, () => {
    console.log(`Servidor de usuários rodando em http://localhost:${port}`);
});

// Exportar a aplicação configurada
module.exports = app;