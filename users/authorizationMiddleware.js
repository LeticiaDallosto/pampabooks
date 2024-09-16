// Importar módulos
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;

// Função para verificar o token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Autorização: ' + authHeader);	
  if (!authHeader) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token inválido!' });
  }
  jwt.verify(token, secret, (err, userDecoded) => {
    if (err) {
      return res.status(500).json({ message: 'Falha na verificação do token!' });
    }
    req.user = userDecoded;
    next();
  });
};

// Exportar a função
module.exports = verifyToken;