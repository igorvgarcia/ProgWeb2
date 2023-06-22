require('dotenv').config();

const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middlewares/authMiddleware');



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

// Middleware para verificar se o usuário está logado
const checkLoggedIn = (req, res, next) => {
  // Verificar se o usuário está logado (exemplo: verificar se o token existe no cookie)
  const isLoggedIn = req.cookies.token ? true : false;

  // Definir a variável isLoggedIn em res.locals para estar disponível em todos os templates
  res.locals.isLoggedIn = isLoggedIn;

  // Chamar o próximo middleware ou manipulador de rota
  next();
};


// Middleware para processar dados JSON
app.use(express.json());
app.use(cookieParser());


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
const cadastroRouter = require('./routes/cadastro');
const userRouter = require('./routes/user');
const editaUserRouter = require('./routes/editaUser');
const paginaCardsRouter = require('./routes/paginaCards');

//API
const rotasAPI = require('./API/rotasAPI');

// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'imgs')));
app.use(checkLoggedIn);

// Middleware para adicionar o token de autenticação ao cabeçalho da requisição
function addTokenToRequest(req, res, next) {
  if (req.user && req.user.token) {
    const token = req.user.token;

    req.headers['authorization'] = `Bearer ${token}`; // Adicione o token ao cabeçalho 'Authorization'
  }

  next();
}



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
app.use('/cadastro', cadastroRouter);
app.use('/login', indexRouter);
app.use('/usuario', addTokenToRequest, userRouter);
app.use('/editauser', addTokenToRequest, editaUserRouter);
app.use('/cards', paginaCardsRouter );

//API
app.use('/api', rotasAPI);





// Aplicar o middleware de verificação de token JWT em rotas protegidas
app.use('/rota_protegida', verifyToken);


// Rota para o cadastro com sucesso
app.get('/cadastro-sucesso', (req, res) => {
  res.render('cadastroSucesso', { title: 'Cadastro realizado com sucesso' });
});


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
