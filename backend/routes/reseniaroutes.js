const express = require('express');
const router = express.Router();
const reseniaController = require('../controllers/reseniaController');
const { check, validationResult } = require('express-validator');

// Middleware para capturar errores de validación
const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

router.get('/', reseniaController.obtenerResenias);
router.get('/:id', reseniaController.obtenerReseniaPorId);

// Validamos al crear una opinión
router.post('/', 
  [
    check('id_usuario', 'El ID de usuario es obligatorio').isInt(),
    check('id_pelicula', 'El ID de película es obligatorio').isInt(),
    check('comentario', 'El comentario no puede estar vacío').not().isEmpty(),
    check('calificacion', 'La calificación debe ser un número entero entre 1 y 5').isInt({ min: 1, max: 5 }),
    validarCampos
  ], 
  reseniaController.crearResenia
);

router.put('/:id', 
  [
    check('calificacion', 'La calificación debe estar entre 1 y 5').optional().isInt({ min: 1, max: 5 }),
    validarCampos
  ], 
  reseniaController.actualizarResenia
);

router.delete('/:id', reseniaController.eliminarResenia);

module.exports = router;