// ubicacion.routes.js
const express = require('express');
const router = express.Router();
const ubicacionController = require('../controllers/ubicacion.controller');

// Rutas básicas CRUD
router.get('/', ubicacionController.getAllUbicaciones);
router.post('/', ubicacionController.createUbicacion);
router.put('/:id', ubicacionController.updateUbicacion);
router.delete('/:id', ubicacionController.deleteUbicacion);

// Ruta para obtener todas las ubicaciones con sus productos
// Importante: Esta ruta debe ir ANTES de las rutas con :id
router.get('/con-productos', ubicacionController.getUbicacionesConProductos);

// Ruta para obtener detalles específicos de una ubicación
router.get('/:id/detalles', ubicacionController.getDetallesUbicacion);

// Ruta para obtener una ubicación específica
router.get('/:id', ubicacionController.getUbicacionById);

module.exports = router;
