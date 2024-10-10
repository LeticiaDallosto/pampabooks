const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Rota para listar todas as Reviews
router.get('/', reviewController.listarReviews);

// Rota para obter uma Review por ID
router.get('/:id', reviewController.obterReviewsPorId);

// Rota para Criar uma Review
router.post('/', reviewController.criarReviews);

// Rota para Atualizar uma Review por ID
router.put('/:id', reviewController.atualizarReview);

// Rota para Deletar uma Review por ID
router.delete('/:id', reviewController.deletarReview);

// Exportar rotas
module.exports = router;