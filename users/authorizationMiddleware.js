// Importar módulos
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

// Função para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({ message: 'Token não fornecido!' });
  }
  jwt.verify(token, secret, (err, userDecoded) => { 
    if (err) {
      return res.status(401).json({ message: 'Falha na verificação do token!' });
    }
    req.user = userDecoded;
    return next();
  });
};

// Exportar a função
module.exports = verifyToken;