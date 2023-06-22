const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./userModel');

const Card = sequelize.define('Card', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: false
  },
  done: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, {
  tableName: 'cards',
  timestamps: false
});

Card.belongsTo(User, { foreignKey: 'usuario' });

module.exports = Card;
