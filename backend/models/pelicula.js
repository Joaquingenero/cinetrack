const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pelicula = sequelize.define('Pelicula', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sinopsis: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  director: {
    type: DataTypes.STRING,
    allowNull: false
  },
  anio_lanzamiento: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  genero: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duracion: {
    type: DataTypes.INTEGER, // En minutos
    allowNull: false
  },
  imagen_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'peliculas',
  timestamps: false
});

module.exports = Pelicula;