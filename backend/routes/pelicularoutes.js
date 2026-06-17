const express = require('express');
const router = express.Router();
const peliculaController = require('../controllers/peliculaController');
const { check, validationResult } = require('express-validator');

// Middleware para capturar los errores de express-validator
const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

// Definición de las rutas del CRUD conectadas al controlador
router.get('/', peliculaController.obtenerPeliculas);
router.get('/:id', peliculaController.obtenerPeliculaPorId);

// Al hacer POST o PUT validamos que los campos obligatorios cumplan las reglas
router.post('/', 
  [
    check('titulo', 'El título es obligatorio y no puede estar vacío').not().isEmpty(),
    check('sinopsis', 'La sinopsis es obligatoria').not().isEmpty(),
    check('director', 'El director es obligatorio').not().isEmpty(),
    check('anio_lanzamiento', 'El año debe ser un número válido').isInt(),
    check('genero', 'El género es obligatorio').not().isEmpty(),
    check('duracion', 'La duración debe ser un número entero de minutos').isInt(),
    validarCampos
  ], 
  peliculaController.crearPelicula
);

router.put('/:id', 
  [
    check('titulo', 'El título no puede estar vacío').optional().not().isEmpty(),
    check('anio_lanzamiento', 'El año debe ser numérico').optional().isInt(),
    check('duracion', 'La duración debe ser numérica').optional().isInt(),
    validarCampos
  ], 
  peliculaController.actualizarPelicula
);

router.delete('/:id', peliculaController.eliminarPelicula);

module.exports = router;