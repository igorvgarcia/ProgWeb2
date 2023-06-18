require('dotenv').config();

const express = require('express');
const mustacheExpress = require('mustache-express');
const path = require('path');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const authenticateToken = require('./authMiddleware');



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




// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'imgs')));

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
app.use('/usuario', verifyToken, addTokenToRequest, userRouter);

// Middleware para verificar o token JWT
function verifyToken(req, res, next) {
  const token = req.cookies.token; //obtenha o token do cookie
  

  if (!token) {
    // Se o token não estiver presente, retorne um status 401 (Unauthorized)
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  // Verifique se o token é válido
  jwt.verify(token, 'seu_segredo', (error, decoded) => {
    if (error) {
      // Se o token for inválido, retorne um status 403 (Forbidden)
      return res.status(403).json({ error: 'Token inválido' });
    }

    // O token é válido, armazene os dados do usuário decodificado no objeto de solicitação (req)
    req.user = decoded;

    // Continue para a próxima função de middleware
    next();
  });
}

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
