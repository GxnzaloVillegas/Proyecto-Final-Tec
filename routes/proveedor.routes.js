const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');

// Rutas para gestionar proveedores
router.get('/', proveedorController.obtenerProveedores); // Obtener todos los proveedores
router.get('/:id_proveedor', proveedorController.obtenerProveedorPorId); // Obtener un proveedor por ID
router.post('/', proveedorController.crearProveedor); // Crear un nuevo proveedor
router.put('/:id_proveedor', proveedorController.actualizarProveedor); // Actualizar un proveedor
router.delete('/:id_proveedor', proveedorController.eliminarProveedor); // Eliminar un proveedor

module.exports = router;
