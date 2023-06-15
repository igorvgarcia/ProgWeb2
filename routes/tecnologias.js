const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Lógica da rota tecnologias
  res.render('tecnologias', { title: 'Tecnologias' });
});

module.exports = router;
