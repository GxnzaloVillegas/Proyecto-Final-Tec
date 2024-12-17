const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marca.controller');

// Ruta para obtener todos los clientes
router.get('/', marcaController.getAllMarca);

// Ruta para crear un nuevo cliente
router.post('/', marcaController.createMarca);

// Ruta para obtener un cliente por ID
router.get('/:id', marcaController.getMarcaById);

// Ruta para actualizar un cliente
router.put('/:id', marcaController.updateMarca);

module.exports = router;
