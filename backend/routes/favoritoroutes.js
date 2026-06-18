const express = require('express');
const router = express.Router();

// GET: Listar favoritos
router.get('/', (req, res) => {
  res.json({ mensaje: "Endpoint de favoritos funcionando" });
});

module.exports = router;