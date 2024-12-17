const {Venta,DetalleVenta} = require('../models/index')
const InventarioUbicacion = require('../models/inventarioUbicacion.model');
const Producto = require('../models/producto.model');
const sequelize = require('../config/bd.config');



const crearVenta = async (ventaData, detallesData) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Crear la venta
    const venta = await Venta.create(ventaData, { transaction });

    // Iterar sobre los detalles de la venta
    for (const detalle of detallesData) {
      // Verificar si el producto está en la ubicación
      const inventario = await InventarioUbicacion.findOne({
        where: {
          id_producto: detalle.id_producto,
          id_ubicacion: venta.id_ubicacion
        },
        transaction
      });

      if (!inventario || inventario.cantidad < detalle.cantidad) {
        throw new Error(`No hay suficiente stock del producto ${detalle.id_producto} en la ubicación`);
      }

      // Disminuir la cantidad en el inventario
      inventario.cantidad -= detalle.cantidad;
      await inventario.save({ transaction });

      // Actualizar el producto como vendido si se vende al menos una unidad
      const producto = await Producto.findByPk(detalle.id_producto, { transaction });
      producto.cantidad_total -= detalle.cantidad;
      producto.vendido = true; // Marcar como vendido inmediatamente
      await producto.save({ transaction });
     
    }
    const detallesVenta = detallesData.map(detalle => ({
      id_venta: venta.id_venta,
      id_producto: detalle.id_producto,
      cantidad: detalle.cantidad,
      pre_unitario: detalle.pre_unitario,
      subtotal: detalle.cantidad * detalle.pre_unitario
    }));

    await DetalleVenta.bulkCreate(detallesVenta, { transaction });

    // Confirmar la transacción
    await transaction.commit();
    return venta;
  } catch (error) {
    // Hacer rollback si hay un error
    await transaction.rollback();
    console.error('Error al crear la venta:', error.message);
    throw new Error('Error al crear la venta');
  }

};
const listarVentas = async () => {
  try {
    const ventas = await Venta.findAll({
      include: [
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto' // Traer información del producto
            }
          ]
        }
      ]
    });
    return ventas;
  } catch (error) {
    console.error('Error al listar las ventas:', error.message);
    throw new Error('Error al listar las ventas');
  }
};

const obtenerVentaPorId = async (idVenta) => {
  try {
    const venta = await Venta.findByPk(idVenta, {
      include: [
        {
          model: DetalleVenta,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto' // Incluir detalles del producto
            }
          ]
        }
      ]
    });

    if (!venta) {
      throw new Error(`Venta con ID ${idVenta} no encontrada`);
    }

    return venta;
  } catch (error) {
    console.error('Error al obtener la venta:', error.message);
    throw new Error('Error al obtener la venta');
  }
};

module.exports = {
  crearVenta,
  listarVentas,
  obtenerVentaPorId
};
