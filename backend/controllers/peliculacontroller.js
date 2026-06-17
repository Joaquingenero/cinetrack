const Pelicula = require('../models/Pelicula');

// 1. Obtener todas las películas (GET)
exports.obtenerPeliculas = async (req, res) => {
  try {
    const peliculas = await Pelicula.findAll();
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las películas', error: error.message });
  }
};

// 2. Obtener una sola película por ID (GET)
exports.obtenerPeliculaPorId = async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la película', error: error.message });
  }
};

// 3. Crear una nueva película (POST)
exports.crearPelicula = async (req, res) => {
  try {
    // Los datos vienen del cuerpo de la petición (req.body)
    const nuevaPelicula = await Pelicula.create(req.body);
    res.status(201).json({ mensaje: 'Película creada con éxito', pelicula: nuevaPelicula });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la película', error: error.message });
  }
};

// 4. Actualizar una película existente (PUT)
exports.actualizarPelicula = async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    await pelicula.update(req.body);
    res.json({ mensaje: 'Película actualizada con éxito', pelicula });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la película', error: error.message });
  }
};

// 5. Eliminar una película (DELETE)
exports.eliminarPelicula = async (req, res) => {
  try {
    const pelicula = await Pelicula.findByPk(req.params.id);
    if (!pelicula) {
      return res.status(404).json({ mensaje: 'Película no encontrada' });
    }
    await pelicula.destroy();
    res.json({ mensaje: 'Película eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la película', error: error.message });
  }
};