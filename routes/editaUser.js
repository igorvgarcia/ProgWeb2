const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');

// Rota POST '/editaUser'
router.post('/', verifyToken, (req, res) => {
    // Lógica da rota POST aqui
  });

// Rota para alterar a senha
router.post('/change-password', verifyToken, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user.username;

  User.findOne({ where: { usuario: username } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (currentPassword !== user.senha) {
        return res.status(401).json({ error: 'Credenciais inválidas: Senha incorreta' });
      }

      user.senha = newPassword; // Atualiza a senha no objeto do usuário

      return user.save(); // Salva as alterações no banco de dados
    })
    .then(() => {
      return res.status(200).json({ message: 'Senha alterada com sucesso' });
    })
    .catch((error) => {
      console.error('Erro ao alterar a senha:', error);
      return res.status(500).json({ error: 'Erro no servidor' });
    });
});

router.post('/delete-account', verifyToken, (req, res) => {
    const currentPassword = req.body.password;
    const username = req.user.username;
    console.log("esse é o req.user",req.user);
    console.log("esse é o req.body",req.body);
    console.log("esse é o req.body.currentPassword",req.body.currentPassword);
  
    User.findOne({ where: { usuario: username } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: 'Usuário não encontrado' });
        }
  
        if (currentPassword !== user.senha) {
          return res.status(401).json({ error: 'Credenciais inválidas: Senha incorreta' });
        }
  
        return user.destroy() // Exclui o usuário do banco de dados
          .then(() => {
            return res.status(200).json({ message: 'Conta excluída com sucesso' });
          })
          .catch((error) => {
            console.error('Erro ao excluir a conta:', error);
            return res.status(500).json({ error: 'Erro no servidor' });
          });
      })
      .catch((error) => {
        console.error('Erro ao buscar o usuário:', error);
        return res.status(500).json({ error: 'Erro no servidor' });
      });
  });
  
  module.exports = router;
  
  


