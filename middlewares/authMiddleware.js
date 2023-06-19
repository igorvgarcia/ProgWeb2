// Middleware para verificar o token JWT

const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token; // Obtém o token do cookie (ou de qualquer outro local que você esteja usando)

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, 'seu_segredo', (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = decoded; // Define as informações do usuário no objeto req.user
    next(); // Chama a próxima função de middleware ou rota
  });
}

module.exports = verifyToken;
