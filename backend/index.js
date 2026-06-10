const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir que el servidor entienda formato JSON
app.use(express.json());

// Ruta principal de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor de CineTrack  con éxito! 🎬');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});