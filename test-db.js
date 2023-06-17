const db = require('./db.js');

// Exemplo de consulta no banco de dados
db.query('SELECT * FROM usuarios', (error, results) => {
  if (error) {
    console.error('Erro ao executar a consulta:', error);
  } else {
    console.log('Resultado da consulta:', results);
  }
});

// Exemplo de inserção de dados no banco de dados
const newUser = { usuario: 'joao', senha: '123456' };
db.query('INSERT INTO usuarios SET ?', newUser, (error, results) => {
  if (error) {
    console.error('Erro ao inserir dados:', error);
  } else {
    console.log('Novo usuário inserido com sucesso');
  }
});

// Exemplo de atualização de dados no banco de dados
const updatedUser = { senha: 'novasenha' };
db.query('UPDATE usuarios SET ? WHERE id = ?', [updatedUser, 1], (error, results) => {
  if (error) {
    console.error('Erro ao atualizar dados:', error);
  } else {
    console.log('Usuário atualizado com sucesso');
  }
});

// Exemplo de exclusão de dados no banco de dados
db.query('DELETE FROM usuarios WHERE id = ?', 1, (error, results) => {
  if (error) {
    console.error('Erro ao excluir dados:', error);
  } else {
    console.log('Usuário excluído com sucesso');
  }
});
