const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');


const app = express();

// Configuração do mustache como view engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

// Importe as rotas
const indexRouter = require('./routes/index');
const contatoRouter = require('./routes/contato');
const tecnologiasRouter = require('./routes/tecnologias');
const sobreRouter = require('./routes/sobre');

// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Roteamento
app.use('/', indexRouter);
app.use('/contato', contatoRouter);
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
