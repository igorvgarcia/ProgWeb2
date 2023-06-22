const express = require('express');
const router = express.Router();

// Simulando dados de tarefas
let todos = [
  { id: 1, descricao: 'Tarefa 1', done: true },
  { id: 2, descricao: 'Tarefa 2', done: true },
  { id: 3, descricao: 'Tarefa 3', done: false },
  { id: 4, descricao: 'Tarefa 4', done: false },
  { id: 5, descricao: 'Tarefa 5', done: false },
  { id: 6, descricao: 'Tarefa 6', done: false }
];

// Rota GET para obter todas as tarefas
router.get('/todos', (req, res) => {
    console.log(todos);
    res.json(todos);
  });
  

// Rota POST para marcar uma tarefa como concluída
router.post('/todos/:id/done', (req, res) => {
  const id = parseInt(req.params.id);

  // Encontrar a tarefa pelo ID
  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Tarefa não encontrada' });
  }

  // Marcar a tarefa como concluída
  todo.done = true;

  res.json({ message: 'Tarefa marcada como concluída' });
});

module.exports = router;
