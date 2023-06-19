require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const cookieParser = require('cookie-parser');

router.use(cookieParser());


router.get('/', (req, res) => {
  // Lógica da rota index
  res.render('index', { title: 'Página Inicial' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log("esse é o req.body",req.body);
  console.log(req.user);

  User.findOne({ where: { usuario: username } })
    .then((user) => {
      if (!user) {
        // Usuário não encontrado no banco de dados
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      if (password !== user.senha) {
        // Senha incorreta
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // As credenciais estão corretas, crie um token JWT
      const token = jwt.sign({ username }, 'seu_segredo');

      console.log(req.user);

      // Envie o token como resposta com redirecionamento para a página de edição do usuário
      res.cookie('token', token); // Defina o token no cookie
      res.redirect('/usuario/edit'); // Redirecione para a página de edição do usuário
    })
    .catch((error) => {
      console.error('Erro ao buscar o usuário no banco de dados:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    });
});


// ...

module.exports = router;
