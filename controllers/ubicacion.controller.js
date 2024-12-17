// ubicacion.controller.js
const ubicacionService = require('../services/ubicacion.service');

class UbicacionController {
  // Obtener todas las ubicaciones
  async getAllUbicaciones(req, res) {
    try {
      const ubicaciones = await ubicacionService.getAllUbicaciones();
      res.json(ubicaciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Obtener una ubicación por ID
  async getUbicacionById(req, res) {
    try {
      const ubicacion = await ubicacionService.getUbicacionById(req.params.id);
      if (!ubicacion) return res.status(404).json({ message: 'Ubicación no encontrada' });
      res.json(ubicacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Crear una nueva ubicación
  async createUbicacion(req, res) {
    try {
      const ubicacion = await ubicacionService.createUbicacion(req.body);
      res.status(201).json(ubicacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Actualizar una ubicación existente
  async updateUbicacion(req, res) {
    try {
      const ubicacion = await ubicacionService.updateUbicacion(req.params.id, req.body);
      res.json(ubicacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Eliminar una ubicación por ID
  async deleteUbicacion(req, res) {
    try {
      await ubicacionService.deleteUbicacion(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUbicacionesConProductos(req, res) {
    try {
      const ubicaciones = await ubicacionService.getUbicacionesConProductos();
      res.json(ubicaciones);
    } catch (error) {
      console.error('Error al obtener ubicaciones con productos:', error);
      res.status(500).json({ message: 'Error al obtener las ubicaciones con productos' });
    }
  }

  async getDetallesUbicacion(req, res) {
    try {
      const { id } = req.params;
      const detalles = await ubicacionService.getDetallesUbicacion(id);
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UbicacionController();
