// Importar módulos
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Rota para criar usuário
router.post('/', async (req, res) => {
    try{
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch(err) {
        res.status(400).send(err);
    }
});

// Rota para buscar usuário
router.get('/', async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).send(users);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Rota para atualizar usuário
router.patch('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
