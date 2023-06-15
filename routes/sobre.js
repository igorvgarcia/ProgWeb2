const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Lógica da rota sobre
  res.render('sobre', { title: 'Sobre' });
});

module.exports = router;
