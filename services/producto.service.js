const Producto = require('../models/producto.model');
const DetalleVenta = require('../models/detalleVenta.model');
const InventarioUbicacion = require('../models/inventarioUbicacion.model');
const Sequelize = require('sequelize');

const obtenerProductos = async () => {
  return await Producto.findAll();
};

const obtenerProductoPorId = async (id) => {
  return await Producto.findByPk(id);
};

const crearProducto = async (productoData) => {
  

  try {
      const nuevoProducto= await Producto.create(productoData);
      return nuevoProducto;
  } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;  // Lanza el error para que sea manejado en el controlador
  }
};

const actualizarProducto = async (id, productoData) => {
  const producto = await Producto.findByPk(id);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }
  return await producto.update(productoData);
};

const eliminarProducto = async (id) => {
  const producto = await Producto.findByPk(id);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }
  return await producto.destroy();
};

const actualizarEstadoProductosVendidos = async () => {
  try {
    // Obtener IDs únicos de productos que han sido vendidos
    const productosVendidos = await DetalleVenta.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('id_producto')), 'id_producto']
      ],
      raw: true
    });

    // Extraer solo los IDs
    const idsProductosVendidos = productosVendidos.map(p => p.id_producto);

    // Actualizar todos los productos encontrados a estado vendido = true
    await Producto.update(
      { vendido: true },
      {
        where: {
          id_producto: idsProductosVendidos
        }
      }
    );

    return {
      success: true,
      message: `Se actualizaron ${idsProductosVendidos.length} productos a estado vendido`,
      productosActualizados: idsProductosVendidos
    };

  } catch (error) {
    console.error('Error al actualizar estado de productos vendidos:', error);
    throw new Error('Error al actualizar estado de productos vendidos');
  }
};

const obtenerProductosPorUbicacion = async (ubicacionId) => {
  try {
    return await InventarioUbicacion.findAll({
      where: { id_ubicacion: ubicacionId },
      include: [{
        model: Producto,
        as: 'producto',
        attributes: ['id_producto', 'nombre', 'precio'],
      }],
      attributes: ['cantidad'],
    });
  } catch (error) {
    console.error('Error al obtener productos por ubicación:', error);
    throw error;
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarEstadoProductosVendidos,
  obtenerProductosPorUbicacion,
};
