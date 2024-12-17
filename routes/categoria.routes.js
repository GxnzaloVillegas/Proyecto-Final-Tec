const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoria.controller');

// Ruta para obtener todos los clientes
router.get('/', categoriaController.getAllCategoria);

// Ruta para crear un nuevo cliente
router.post('/', categoriaController.createCategoria);

// Ruta para obtener un cliente por ID
router.get('/:id', categoriaController.getCategoriaById);

// Ruta para actualizar un cliente
router.put('/:id', categoriaController.updateCategoria);

module.exports = router;
