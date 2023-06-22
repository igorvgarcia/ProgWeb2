const express = require('express');
const router = express.Router();

const Card = require('../models/cardsModel');

const verifyToken = require('../middlewares/authMiddleware');

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
router.get('/todos', verifyToken, async (req, res) => {
    const username = req.user.username;

     // Consultar apenas os cards do usuário logado
  Card.findAll({
    where: { usuario: username }
  })
    .then(cards => {
      res.json(cards);
    })
    .catch(error => {
      console.error('Erro ao obter os cards:', error);
      res.status(500).json({ error: 'Erro ao obter os cards' });
    });
  });
  

// Rota POST para marcar uma tarefa como concluída
router.post('/todos/:id/done', async (req, res) => {
    const id = parseInt(req.params.id);
  
    try {
      const card = await Card.findByPk(id);
      
      if (!card) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
      }
  
      // Marcar o card como concluído
      card.done = true;
      await card.save();
  
      res.json({ message: 'Tarefa marcada como concluída' });
    } catch (error) {
      console.error('Erro ao marcar a tarefa como concluída:', error);
      res.status(500).json({ error: 'Erro ao marcar a tarefa como concluída' });
    }
  });

  // Rota POST para criar um novo card
router.post('/todos', verifyToken, async (req, res) => {
    console.log(req.body);
    console.log(req.user);
    const username = req.user.username;


    try {
      const { descricao, done } = req.body;
  
      // Cria o novo card no banco de dados
      const newCard = await Card.create({
        descricao,
        done,
        usuario: username
      });
  
      res.status(201).json(newCard);
    } catch (error) {
      console.error('Erro ao criar o card:', error);
      res.status(500).json({ error: 'Erro ao criar o card' });
    }
  });

  // Deletar um card específico
router.delete('/todos/:id', (req, res) => {
    const cardId = req.params.id;
  
    // Procurar o card pelo ID e remover do banco de dados
    Card.destroy({
      where: { id: cardId }
    })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Erro ao deletar o card:', error);
        res.status(500).json({ error: 'Erro ao deletar o card' });
      });
  });

  // Rota PUT para alterar a descrição de um card
router.put('/todos/:id', async (req, res) => {
    const cardId = req.params.id;
    const { descricao } = req.body;
  
    try {
      // Procurar o card pelo ID
      const card = await Card.findByPk(cardId);
  
      if (!card) {
        return res.status(404).json({ error: 'Card não encontrado' });
      }
  
      // Atualizar a descrição do card
      card.descricao = descricao;
      await card.save();
  
      res.json(card);
    } catch (error) {
      console.error('Erro ao alterar a descrição do card:', error);
      res.status(500).json({ error: 'Erro ao alterar a descrição do card' });
    }
  });
  
  
  

module.exports = router;
