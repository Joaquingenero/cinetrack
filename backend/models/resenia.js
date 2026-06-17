const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resenia = sequelize.define('Resenia', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_pelicula: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  calificacion: {
    type: DataTypes.INTEGER, // Valor del 1 al 5
    allowNull: false
  },
  comentario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'resenias',
  timestamps: false
});

module.exports = Resenia;