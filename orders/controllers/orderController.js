// Importar módulos
const Order = require('../models/orderModel');
const axios = require('axios');
require('dotenv').config();

// Função para listar todos os pedidos
const orderList = async (req, res) => {
    try {
        const orders = await Order.find();
        if (orders.length === 0) {
            return res.status(200).json({ message: 'Nenhum pedido encontrado' });
        }
        res.status(200).json(orders);
    } catch (erro) {
        res.status(500).send('Erro ao listar pedidos');
    }
};

// Função para criar um pedido
const orderCreate = async (req, res) => {
    const orders = req.body.orders;
    try {
        const createdOrders = [];
        const orderItems = {};

        // Agrupar itens por bookId e calcular a quantidade total
        for (const order of orders) {
            const { bookId, quantity } = order;
            if (!orderItems[bookId]) {
                orderItems[bookId] = { quantity: 0 };
            }
            orderItems[bookId].quantity += quantity;
        }

        // Criar um único pedido com os itens agrupados
        for (const bookId in orderItems) {
            const productResponse = await axios.get(`http://localhost:3003/catalog/${bookId}`);
            const product = productResponse.data;
            if (!product) {
                return res.status(404).send('Produto não encontrado');
            }
            const newOrder = new Order({
                bookId: bookId,
                bookName: product.name,
                quantity: orderItems[bookId].quantity,
                totalPrice: product.price * orderItems[bookId].quantity
            });
            await newOrder.save();
            createdOrders.push(newOrder);
        }

        res.status(201).json({ message: 'Pedido criado com sucesso', orders: createdOrders });
    } catch (erro) {
        console.error('Erro ao criar pedido:', erro);
        res.status(500).send('Erro ao criar pedido');
    }
};

// Exportar funções
module.exports = { orderList, orderCreate };