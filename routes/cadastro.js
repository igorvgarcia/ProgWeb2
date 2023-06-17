const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  res.render('cadastro', { title: 'Cadastro' });
});

router.post('/', (req, res) => {
  const { username, password, passwordConfirmacao } = req.body;

  // Verifique se os campos do formulário foram preenchidos corretamente
  if (!username || !password || !passwordConfirmacao) {
    res.render('cadastroSucesso', { title: 'Cadastro', error: 'Por favor, preencha todos os campos' });
    return;
  }

  // Verifique se a senha e a confirmação da senha coincidem
  if (password !== passwordConfirmacao) {
    res.render('cadastroSucesso', { title: 'Cadastro', error: 'A senha e a confirmação da senha não coincidem' });
    return;
  }

  // Verifique se o usuário já está cadastrado no banco de dados
  db.query('SELECT * FROM usuarios WHERE usuario = ?', [username], (error, results) => {
    if (error) {
      console.error('Erro ao verificar o usuário no banco de dados:', error);
      res.render('cadastroSucesso', { title: 'Cadastro', error: 'Ocorreu um erro ao processar a solicitação' });
      return;
    }

    if (results.length > 0) {
      res.render('cadastroSucesso', { title: 'Cadastro', error: 'O usuário já está cadastrado' });
      return;
    }

    // Insira o novo usuário no banco de dados
    const newUser = {
      usuario: username,
      senha: password,
    };
    db.query('INSERT INTO usuarios SET ?', newUser, (error, results) => {
      if (error) {
        console.error('Erro ao cadastrar o usuário no banco de dados:', error);
        res.render('cadastroSucesso', { title: 'Cadastro', error: 'Ocorreu um erro ao processar a solicitação' });
        return;
      }

      res.render('cadastroSucesso', { title: 'Cadastro', success: 'Usuário cadastrado com sucesso' });
    });
  });
});

module.exports = router;
