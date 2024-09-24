// Importar módulos
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Rota para listar todos os pedidos
router.get('/', orderController.orderList);

// Rota para criar um pedido
router.post('/', orderController.orderCreate);

// Exportar rotas
module.exports = router;

