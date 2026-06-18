const express = require('express');
const router = express.Router();

// GET: Listar directores
router.get('/', (req, res) => {
  res.json({ mensaje: "Endpoint de directores funcionando" });
});

module.exports = router;