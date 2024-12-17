// ubicacion.service.js
const { QueryTypes } = require('sequelize');
const db = require('../config/bd.config');
const { Ubicacion, Producto, InventarioUbicacion, Categoria, Marca } = require('../models');

class UbicacionService {
  // Obtener todas las ubicaciones
  async getAllUbicaciones() {
    return await Ubicacion.findAll();
  }

  // Obtener una ubicación por ID
  async getUbicacionById(id) {
    return await Ubicacion.findByPk(id);
  }

  // Crear una nueva ubicación
  async createUbicacion(data) {
    return await Ubicacion.create(data);
  }

  // Actualizar una ubicación existente
  async updateUbicacion(id, data) {
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) throw new Error('Ubicación no encontrada');
    return await ubicacion.update(data);
  }

  // Eliminar una ubicación por ID
  async deleteUbicacion(id) {
    const ubicacion = await Ubicacion.findByPk(id);
    if (!ubicacion) throw new Error('Ubicación no encontrada');
    return await ubicacion.destroy();
  }

  // Nuevo método para obtener ubicaciones con cantidad de productos
  async getUbicacionesConProductos() {
    try {
      const ubicaciones = await Ubicacion.findAll({
        include: [{
          model: Producto,
          as: 'productos',
          through: {
            model: InventarioUbicacion,
            attributes: ['cantidad']
          },
          include: [
            { model: Categoria, as: 'categoria' },
            { model: Marca, as: 'marca' }
          ]
        }],
        attributes: ['id_ubicacion', 'nombre', 'descripcion']
      });

      return ubicaciones.map(ubicacion => {
        const totalProductos = ubicacion.productos?.length || 0;
        const totalItems = ubicacion.productos?.reduce((sum, prod) => sum + (prod.InventarioUbicacion?.cantidad || 0), 0) || 0;
        
        return {
          ...ubicacion.toJSON(),
          estadisticas: {
            total_productos: totalProductos,
            total_items: totalItems,
            porcentaje_ocupacion: this.calcularPorcentajeOcupacion(totalItems)
          }
        };
      });
    } catch (error) {
      console.error('Error en getUbicacionesConProductos:', error);
      throw error;
    }
  }

  // Método para obtener detalles específicos de una ubicación
  async getDetallesUbicacion(id_ubicacion) {
    try {
      const detalles = await db.sequelize.query(`
        SELECT 
          u.id_ubicacion,
          u.nombre,
          u.descripcion,
          COUNT(DISTINCT iu.id_producto) as total_productos,
          COALESCE(SUM(iu.cantidad), 0) as total_items,
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id_producto', p.id_producto,
                'nombre', p.nombre,
                'cantidad', iu2.cantidad,
                'categoria', c.nombre,
                'marca', m.nombre
              )
            )
            FROM InventarioUbicacion iu2
            JOIN Producto p ON iu2.id_producto = p.id_producto
            LEFT JOIN Categoria c ON p.id_categoria = c.id_categoria
            LEFT JOIN Marca m ON p.id_marca = m.id_marca
            WHERE iu2.id_ubicacion = u.id_ubicacion
          ) as productos_detalle
        FROM Ubicacion u
        LEFT JOIN InventarioUbicacion iu ON u.id_ubicacion = iu.id_ubicacion
        WHERE u.id_ubicacion = :id_ubicacion
        GROUP BY u.id_ubicacion, u.nombre, u.descripcion
      `, {
        replacements: { id_ubicacion },
        type: QueryTypes.SELECT
      });

      if (!detalles || detalles.length === 0) {
        throw new Error('Ubicación no encontrada');
      }

      const detalle = detalles[0];
      return {
        ...detalle,
        productos_detalle: JSON.parse(detalle.productos_detalle || '[]'),
        estadisticas: {
          total_productos: detalle.total_productos,
          total_items: detalle.total_items,
          porcentaje_ocupacion: this.calcularPorcentajeOcupacion(detalle.total_items)
        }
      };
    } catch (error) {
      console.error('Error al obtener detalles de ubicación:', error);
      throw new Error('Error al obtener los detalles de la ubicación');
    }
  }

  // Método auxiliar para calcular el porcentaje de ocupación
  calcularPorcentajeOcupacion(totalItems) {
    const CAPACIDAD_MAXIMA = 1000; // Puedes ajustar este valor según tus necesidades
    return Math.min(Math.round((totalItems / CAPACIDAD_MAXIMA) * 100), 100);
  }
}

module.exports = new UbicacionService();
