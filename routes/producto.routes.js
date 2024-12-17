const express = require('express');
const productoController = require('../controllers/producto.controller');

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/', productoController.obtenerProductos);

// Ruta para obtener un producto por su id
router.get('/:id', productoController.obtenerProductoPorId);

// Ruta para crear un nuevo producto
router.post('/', productoController.crearProducto);

// Ruta para actualizar un producto existente
router.put('/:id', productoController.actualizarProducto);

// Ruta para eliminar un producto
router.delete('/:id', productoController.eliminarProducto);

// Ruta para actualizar estado vendidos
router.post('/actualizar-estado-vendidos', productoController.actualizarEstadoHistoricoVentas);

// Ruta para obtener productos por ubicación
router.get('/ubicacion/:ubicacionId', productoController.obtenerProductosPorUbicacion);

module.exports = router;
