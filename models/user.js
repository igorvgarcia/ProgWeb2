// user.js

const connection = require('./db.js');

class User {
  // ...

  static create(username, password, callback) {
    // Código para criar um novo usuário no banco de dados
    const query = 'INSERT INTO usuarios (usuario, senha) VALUES (?, ?)';
    const values = [username, password];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        const id = results.insertId;
        const user = new User(id, username, password);
        callback(null, user);
      }
    });
  }

  static findByUsername(username, callback) {
    // Código para buscar um usuário por nome de usuário no banco de dados
    const query = 'SELECT * FROM usuarios WHERE usuario = ?';
    const values = [username];

    connection.query(query, values, (error, results) => {
      if (error) {
        callback(error, null);
      } else {
        if (results.length === 0) {
          callback(null, null); // Usuário não encontrado
        } else {
          const { id, usuario, senha } = results[0];
          const user = new User(id, usuario, senha);
          callback(null, user);
        }
      }
    });
  }

  // ...
}

module.exports = User;
