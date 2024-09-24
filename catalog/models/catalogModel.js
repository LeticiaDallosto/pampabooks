// Importar módulos
const mongoose = require('mongoose');

// Definir schema do usuário
const catalogSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: false},
    category: {type: String, required: false},
    criationDate: {type: Date, default: Date.now},
});

// Definir modelo do usuário
const Catalog = mongoose.model('Catalog', catalogSchema);

// Exportar modelo
module.exports = Catalog;