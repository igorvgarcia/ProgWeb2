var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

router.get('/', (req, res) => {
  // Lógica da rota index
  res.render('usuario', { title: 'Página Inicial' });
});

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, 'seu_segredo', (error, decoded) => {
    if (error) {
      return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = decoded;
    next();
  });
}

// Rota protegida que requer autenticação
router.get('/edit', verifyToken, (req, res) => {
  // Aqui você pode implementar a lógica para a página do usuário
  // Você pode acessar o usuário autenticado através de req.user.username
  console.log(req.user.username);
  console.log(req.user.id);
  console.log(req.user);
  res.render('usuario', { title: 'editar usuario', username: req.user.username });
  console.log("passou");
});

module.exports = router;
