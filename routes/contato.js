const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


router.get('/', (req, res) => {
  // Lógica da rota contato
  res.render('contato', { title: 'Contato' });
});

// Rota para o envio de email
router.post('/enviar-email', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;


  const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'igorgarcia@alunos.utfpr.edu.br',
    subject: assunto,
    text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send('Ocorreu um erro ao enviar o email.');
    } else {
      console.log('Email enviado:', info.response);
      res.send('Email enviado com sucesso!');
    }
  });
});

module.exports = router;
