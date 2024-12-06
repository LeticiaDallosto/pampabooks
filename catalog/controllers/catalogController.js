// Importar módulos
const Catalog = require('../models/catalogModel');
require('dotenv').config();

// Função para criar um produto
const productCreate = async (req, res) => {
    const product = new Catalog({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category
    });
    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar o produto' });
    }
};

// Função para atualizar um produto
const productUpdate = async (req, res) => {
    try {
        const product = await Catalog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar o produto' });
    }
};

// Função para deletar um produto
const productDelete = async (req, res) => {
    try {
        const product = await Catalog.findByIdAndDelete(req.params.id);
        if (product) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar o produto' });
    }
};

// Função para listar todos os produtos
const productList = async (req, res) => {
    try {
        const products = await Catalog.find();
        res.json(products);
    } catch (err) {
        res.status(500).send('Erro ao listar produtos: ' + err);
    }
};

// Função para buscar um produto pelo ID
const productById = async (req, res) => {
    try {
        const product = await Catalog.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(400).json({ message: 'Produto não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar o produto' });
    }
};

// Exportar funções
module.exports = { productCreate, productUpdate, productDelete, productList, productById };