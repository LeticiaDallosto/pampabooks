const express = require('express');
const router = express.Router();
const controladorReview = require('../controllers/reviewController');

// Prefixo '/api/reviews' já está sendo usado no index.js

// Rota para listar todas as Reviews
router.get('/reviews', controladorReview.listarReviews);

// Rota para obter uma Review por ID
router.get('/reviews/:id', controladorReview.obterReviewsPorId);

// Rota para Criar uma Review
router.post('/reviews', controladorReview.criarReviews);

// Rota para Atualizar uma Review por ID
router.put('/reviews/:id', controladorReview.atualizarReview);

// Rota para Deletar uma Review por ID
router.delete('/reviews/:id', controladorReview.deletarReview);

// Exportar rotas
module.exports = router;