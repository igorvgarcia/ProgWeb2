const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Lógica da rota contato
  res.render('contato', { title: 'Contato' });
});

module.exports = router;
