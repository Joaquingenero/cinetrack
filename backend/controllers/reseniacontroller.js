const Resenia = require('../models/Resenia');

// 1. Obtener todas las reseñas (GET)
exports.obtenerResenias = async (req, res) => {
  try {
    const resenias = await Resenia.findAll();
    res.json(resenias);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las reseñas', error: error.message });
  }
};

// 2. Obtener una sola reseña por ID (GET)
exports.obtenerReseniaPorId = async (req, res) => {
  try {
    const resenia = await Resenia.findByPk(req.params.id);
    if (!resenia) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    res.json(resenia);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la reseña', error: error.message });
  }
};

// 3. Crear una nueva reseña (POST)
exports.crearResenia = async (req, res) => {
  try {
    const nuevaResenia = await Resenia.create(req.body);
    res.status(201).json({ mensaje: 'Reseña creada con éxito', resenia: nuevaResenia });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la reseña', error: error.message });
  }
};

// 4. Actualizar una reseña existente (PUT)
exports.actualizarResenia = async (req, res) => {
  try {
    const resenia = await Resenia.findByPk(req.params.id);
    if (!resenia) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    await resenia.update(req.body);
    res.json({ mensaje: 'Reseña actualizada con éxito', resenia });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la reseña', error: error.message });
  }
};

// 5. Eliminar una reseña (DELETE)
exports.eliminarResenia = async (req, res) => {
  try {
    const resenia = await Resenia.findByPk(req.params.id);
    if (!resenia) {
      return res.status(404).json({ mensaje: 'Reseña no encontrada' });
    }
    await resenia.destroy();
    res.json({ mensaje: 'Reseña eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la reseña', error: error.message });
  }
};