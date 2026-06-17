const { Sequelize } = require('sequelize');
const path = require('path');

// Configuración de Sequelize con SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false // Para que no llene la consola de texto SQL
});

module.exports = sequelize;