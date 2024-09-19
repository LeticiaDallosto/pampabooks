// Importar módulos
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
require('dotenv').config();
const secret = process.env.SECRET;
const secretRefresh = process.env.SECRET_REFRESH;

// Função para registrar usuário
const userRegister = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { name, password, email, age, photo } = req.body;
    if (!email) {
        return res.status(400).json({message: 'Email é obrigatório!'});
    }
    try {
        const encryptedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({name, password: encryptedPassword, email, age, photo});
        await newUser.save();
        res.status(201).json({message: 'Usuário registrado com sucesso!'});
    } catch(err) {
        res.status(500).json({message: 'Erro ao registrar usuário: ' + err});
    }
};

// Função para fazer login
const userLogin = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { name, password } = req.body;
    try {
        const user = await User.findOne({name});
        if(!user) {
            return res.status(404).json({message: 'Usuário não encontrado!'});
        }
        const validPassword = bcrypt.compareSync(password, user.password);
        if(!validPassword) {
            return res.status(401).json({message: 'Senha inválida!'});
        }
        const tokens = generateTokens(user);
        res.json({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    } catch(err) {
        res.status(500).json({message: 'Erro ao fazer login: ' + err});
    }
};

// Função para gerar tokens de acesso
const generateTokens = (user) => {
    const accessToken = jwt.sign({name: user.name}, secret, {expiresIn: '1h'});
    const refreshToken = jwt.sign({name: user.name}, secretRefresh, {expiresIn: '7d'});
    return {accessToken, refreshToken};
};

// Função para renovar token
const renewToken = (req, res) => {
    const { refreshToken } = req.body;
    if(!refreshToken) {
        return res.status(403).json({message: 'Token de renovação não fornecido!'});
    }
    jwt.verify(refreshToken, secretRefresh, (err, user) => {
        if(err) {
            return res.status(401).json({message: 'Token de renovação inválido!'});
        }
        const newToken = jwt.sign({name: user.name}, secret, {expiresIn: '1h'});
        res.json({token: newToken});
    });
};

// Exportar funções
module.exports = { userRegister, userLogin, renewToken };