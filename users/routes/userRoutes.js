// Importar módulos
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Criar aplicação express
const app = express();

// Rota para criar usuário
app.post('/users', async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Rota para buscar usuário
app.get('/users', async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).send(users);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Rota para atualizar usuário
app.patch('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).send(user);
        if(!user) {
            res.status(404).send('Usuário não encontrado!');
        }
        res.send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Rota para deletar usuário
app.delete('/users/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user) {
            res.status(404).send('Usuário não encontrado!');
        }
        res.send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Exportar rotas
module.exports = router;
