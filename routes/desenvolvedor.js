const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // Lógica da rota desenvolvedor
    res.render('desenvolvedor', { title: 'Desenvolvedor' });
});

module.exports = router;



