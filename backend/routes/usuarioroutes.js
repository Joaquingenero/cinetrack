const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { check, validationResult } = require('express-validator');

// Middleware para capturar errores de validación
const validarCampos = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Validamos el registro de usuarios
router.post('/', 
  [
    check('nombre_usuario', 'El nombre de usuario es obligatorio').not().isEmpty(),
    check('email', 'Agrega un email válido').isEmail(),
    check('contrasenia', 'La contraseña debe tener mínimo 6 caracteres').isLength({ min: 6 }),
    validarCampos
  ], 
  usuarioController.crearUsuario
);

router.put('/:id', 
  [
    check('email', 'Agrega un email válido').optional().isEmail(),
    validarCampos
  ], 
  usuarioController.actualizarUsuario
);

router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;