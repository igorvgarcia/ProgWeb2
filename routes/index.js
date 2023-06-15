const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Lógica da rota index
  res.render('index', { title: 'Página Inicial' });
});

module.exports = router;
