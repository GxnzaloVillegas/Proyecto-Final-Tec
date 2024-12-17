// inventario.controller.js
const inventarioService = require('../services/inventario.service');

class InventarioController {
  // Listar productos por inventario en una ubicación específica
  async listarProductosPorInventario(req, res) {
    try {
      const productos = await inventarioService.obtenerProductosPorUbicacion(req.params.id_ubicacion);
      res.json(productos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }}

  module.exports = new InventarioController();