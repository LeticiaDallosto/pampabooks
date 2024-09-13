// Importar módulos
const mongoose = require('mongoose');

// Definir schema do usuário
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, match: [/^[a-zA-z0-9._%+-]+@[a-zA-z0-9.-]+\.[a-zA-Z]{2,}$/, 'Email inválido.']},
    age: {type: Number, min: [0, 'Idade não pode ser negativa.']},
    photo: {type: Buffer, required: false}
});

// Definir modelo do usuário
const User = mongoose.model('User', userSchema);

// Exportar modelo
module.exports = User;