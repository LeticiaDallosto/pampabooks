// Importar módulos
const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Rota para listar todos os produtos
router.get('/', catalogController.productList);

// Rota para buscar um produto pelo ID
router.get('/:id', catalogController.productById);

// Rota para criar um produto
router.post('/', catalogController.productCreate);

// Rota para atualizar um produto
router.put('/:id', catalogController.productUpdate);

// Rota para deletar um produto
router.delete('/:id', catalogController.productDelete);

// Exportar rotas
module.exports = router;