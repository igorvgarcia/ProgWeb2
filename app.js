require('dotenv').config();

const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');


console.log(process.env.SMTP_HOST);
console.log(process.env.SMTP_PORT);
console.log(process.env.SMTP_USER);
console.log(process.env.SMTP_PASS);

const app = express();

//Configuração do nodemailer //USANDO DOTENV
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// Middleware para processar dados JSON
app.use(express.json());


// Configuração do mustache como view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Importe as rotas
const indexRouter = require('./routes/index');
const contatoRouter = require('./routes/contato');
const tecnologiasRouter = require('./routes/tecnologias');
const sobreRouter = require('./routes/sobre');
const desenvolvedorRouter = require('./routes/desenvolvedor');

// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Roteamento
app.use('/', indexRouter);
app.use('/contato', (req, res, next) => {
  req.transporter = transporter; // Passa o transporter para a requisição
  next();
}, contatoRouter);
app.use('/enviar-email', contatoRouter);
app.use('/desenvolvedor', desenvolvedorRouter);
app.use('/tecnologias', tecnologiasRouter);
app.use('/sobre', sobreRouter);

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Inicie o servidor
app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001');
});

module.exports = app;
