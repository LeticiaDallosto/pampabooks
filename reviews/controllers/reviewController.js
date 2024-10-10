// Importar módulos
const Review = require('../models/reviewModel');
require('dotenv').config();

// Listar todas as reviews
exports.listarReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 }); // Ordenar por data de criação descendente
        res.json(reviews);
    } catch (erro) {
        console.error('Erro ao listar as reviews:', erro);
        res.status(500).json({ mensagem: 'Erro ao listar as reviews', erro: erro.message });
    }
};

// Obter uma review por ID
exports.obterReviewsPorId = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ mensagem: 'Review não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao obter a review:', erro);
        res.status(500).json({ mensagem: 'Erro ao obter a review', erro: erro.message });
    }
};

// Criar uma nova review
exports.criarReviews = async (req, res) => {
    console.log('Recebido dados do frontend:', req.body); // Log para depuração

    const { bookId, bookName, userId, userName, rating, reviewText } = req.body;

    // Validação dos campos
    if (!bookId || !bookName || !userId || !userName || !rating || !reviewText) {
        console.log('Campos obrigatórios faltando!');
        return res.status(400).json({ mensagem: 'Campos obrigatórios faltando!' });
    }

    const novaReview = new Review({
        bookId,
        bookName,
        userId,
        userName,
        rating,
        reviewText,
    });

    try {
        const reviewSalva = await novaReview.save();
        console.log('Review salva no banco de dados:', reviewSalva);
        res.status(201).json(reviewSalva);
    } catch (erro) {
        console.error('Erro ao criar a review:', erro);
        res.status(400).json({ mensagem: 'Erro ao criar a Review', erro: erro.message });
    }
};

// Atualizar uma review por ID
exports.atualizarReview = async (req, res) => {
    try {
        const { bookId, bookName, userId, userName, rating, reviewText } = req.body;

        // Validação dos campos
        if (!bookId || !bookName || !userId || !userName || !rating || !reviewText) {
            return res.status(400).json({ mensagem: 'Campos obrigatórios faltando!' });
        }

        const reviewAtualizada = await Review.findByIdAndUpdate(
            req.params.id,
            {
                bookId,
                bookName,
                userId,
                userName,
                rating,
                reviewText,
            },
            { new: true, runValidators: true } // Retornar o documento atualizado e validar
        );

        if (reviewAtualizada) {
            res.json(reviewAtualizada);
        } else {
            res.status(404).json({ mensagem: 'Review não encontrada' });
        }
    } catch (erro) {
        console.error('Erro ao atualizar a review:', erro);
        res.status(400).json({ mensagem: 'Erro ao atualizar a Review', erro: erro.message });
    }
};

// Deletar uma review por ID
exports.deletarReview = async (req, res) => {
    try {
        const reviewDeletada = await Review.findByIdAndDelete(req.params.id);
        if (reviewDeletada) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ mensagem: 'Review não localizada' });
        }
    } catch (erro) {
        console.error('Erro ao deletar a review:', erro);
        res.status(500).json({ mensagem: 'Erro ao deletar Review', erro: erro.message });
    }
};
