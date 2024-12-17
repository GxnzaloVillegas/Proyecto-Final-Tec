// inventario.routes.js
const express = require('express');
const router = express.Router();
const inventarioController = require('../controllers/inventario.controller');

// Listar productos por inventario en una ubicación
router.get('/:id_ubicacion', inventarioController.listarProductosPorInventario);


module.exports = router;
