// Importar módulos
const Order = require('../models/orderModel');
const axios = require('axios');
require('dotenv').config();

// Função para listar todos os pedidos
const orderList = async (req,res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (erro) {
        res.status(500).send('Erro ao listar pedidos');
    }
};

// Função para criar um pedido
const orderCreate = async (req,res) => {
    const { bookId, quantity } = req.body;
    try {
        const productResponse = await axios.get(`http://localhost:3003/catalog/${bookId}`);
        const product = productResponse.data;
        if(!product) {
            return res.status(404).send('Produto não encontrado');
        }
        const newOrder = new Order({
            bookId: product.id,
            bookName: product.name,
            quantity,
            totalPrice: product.price * quantity
        });
        await newOrder.save();
        res.status(201).send('Pedido criado com sucesso');
    }  catch (erro) {
        console.log(erro);
        res.status(500).send('Erro ao criar pedido');
    }
};

// Exportar funções
module.exports = { orderList, orderCreate };