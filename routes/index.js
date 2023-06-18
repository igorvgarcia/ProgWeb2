require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const db = require('../db');
const authenticateToken = require('../authMiddleware');
const cookieParser = require('cookie-parser');

router.use(cookieParser());


router.get('/', (req, res) => {
  // Lógica da rota index
  res.render('index', { title: 'Página Inicial' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  //console.log(username);
  //console.log(password);

  // Verifique se o usuário e a senha estão corretos
  User.findByUsername(username, (error, user) => {
    if (error) {
      // Ocorreu um erro ao buscar o usuário no banco de dados
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (!user) {
      // Usuário não encontrado no banco de dados

      return res.status(401).json({ error: 'Credenciais inválidas aq' });
    }

    // console.log(user);
    // console.log(user.password);

    if (password !== user.password) {
      // Senha incorreta

      return res.status(401).json({ error: 'Credenciais inválidas: Senha incorreta' });
    }

    // As credenciais estão corretas, crie um token JWT
    const token = jwt.sign({ username }, 'seu_segredo');

    // Envie o token como resposta com redirecionamento para a página de edição do usuário
    res.cookie('token', token); // Defina o token no cookie
    res.redirect('/usuario/edit'); // Redirecione para a página de edição do usuário

  



    // Envie o token como resposta
    //res.json({ token });
  });
});


// ...

module.exports = router;










// ...

module.exports = router;
