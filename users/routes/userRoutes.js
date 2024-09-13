// Importar módulos
const express = require('express');
const { check } = require('express-validator');
const { userRegister, userLogin, renewToken } = require('../controllers/userController');
const router = express.Router();
const User = require('../models/userModel');
const verifyToken = require('../authorizationMiddleware');

// Rota para criar usuário
router.post('/register', [
    check('name').not().isEmpty().withMessage('Nome é obrigatório.'),
    check('password').isLength({min: 6}).withMessage('Senha deve ter no mínimo 6 caracteres.')
], userRegister);

// Rota para login do usuário
router.post('/login', [
    check('name').not().isEmpty().withMessage('Nome é obrigatório.'),
    check('password').isLength({min: 6}).withMessage('Senha deve ter no mínimo 6 caracteres.')
], userLogin);

// Rota protegida
router.get('/protecteData', verifyToken, (req, res) => {
    res.jason({ message: 'Você tem acesso a essa rota protegida!', user: req.user });
});

// Rota para renovar token
router.post('/renewToken', renewToken);

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
