const express = require('express');
const ventaController = require('../controllers/venta.controller');

const router = express.Router();

// Ruta para crear una venta
router.post('/', ventaController.crearVenta);

// Ruta para listar todas las ventas
router.get('/', ventaController.listarVentas);

// Ruta para obtener una venta por su ID
router.get('/:idVenta', ventaController.obtenerVentaPorId);

module.exports = router;
