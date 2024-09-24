// Importar módulos
const Order = require('../models/orderModel');
const axios = require('axios');

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
        const responseOrder = await axios.get(`http://localhost:3004/produtos/${bookId}`);
        const order = responseOrder.date;

        if(!order) {
            return res.status(404).send('Produto não encontrado');
        }
        const newOrder = new Order({
            bookId: book.id,
            bookName: book.name,
            quantity,
            totalPrice: book.price * quantity
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