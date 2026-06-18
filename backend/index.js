const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Importamos los modelos para la base de datos SQLite 
const Pelicula = require('./models/Pelicula'); 
const Usuario = require('./models/Usuario'); 
const Resenia = require('./models/Resenia'); 
const Director = require('./models/Director');
const Favorito = require('./models/Favorito');

// Importamos las rutas de los Endpoints
const peliculaRoutes = require('./routes/peliculaRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes'); 
const reseniaRoutes = require('./routes/reseniaRoutes'); 
const directorRoutes = require('./routes/directorRoutes'); 
const favoritoRoutes = require('./routes/favoritoRoutes'); 

const app = express();
const PORT = 3000;

// Middlewares globales
app.use(cors());
app.use(express.json()); 

// Conexión de las rutas a la API
app.use('/api/peliculas', peliculaRoutes);
app.use('/api/usuarios', usuarioRoutes); 
app.use('/api/resenias', reseniaRoutes); 
app.use('/api/directores', directorRoutes); // <-- ¡Nueva conexión 4!
app.use('/api/favoritos', favoritoRoutes);   // <-- ¡Nueva conexión 5!

// Ruta base de prueba para el navegador
app.get('/', (req, res) => {
  res.send('Servidor de CineTrack corriendo impecable con 5 entidades 🚀');
});

// Sincronizar Base de Datos y arrancar el servidor
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('📌 Base de datos SQLite y 5 tablas sincronizadas con éxito.');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error crítico al conectar la base de datos:', err);
  });