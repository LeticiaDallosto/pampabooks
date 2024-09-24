// Importar módulos
const mongoose = require('mongoose');

// Definir schema do usuário
const orderSchema = new mongoose.Schema({
    bookId: {type: String, required: true},
    bookName: {type: String, required: true},
    quantity: {type: Number, required: true},
    totalPrice: {type: Number, required: true},
});

// Definir modelo do usuário
const Order = mongoose.model('Order', orderSchema);

// Exportar modelo
module.exports = Order;