const express = require('express');
const router = express.Router();

// Simulando dados de tarefas
let todos = [
  { id: 1, descricao: 'Tarefa 1', done: false },
  { id: 2, descricao: 'Tarefa 2', done: true },
  { id: 3, descricao: 'Tarefa 3', done: false }
];

// Rota GET para obter todas as tarefas
router.get('/', (req, res) => {
    console.log(todos);
    res.render('paginaCards');
});

module.exports = router;
