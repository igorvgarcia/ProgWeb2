const express = require('express');
const router = express.Router();



// Rota GET para obter todas as tarefas
router.get('/', (req, res) => {
    res.render('paginaCards');
});

module.exports = router;
