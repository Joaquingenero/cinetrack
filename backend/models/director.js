const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Director = sequelize.define('Director', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nacionalidad: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false // Para que no te cree las columnas createdAt y updatedAt si no las usan
});

module.exports = Director;