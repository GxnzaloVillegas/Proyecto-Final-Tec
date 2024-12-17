const { Sequelize } = require('sequelize');
const Producto = require('../models/producto.model');
const DetalleVenta = require('../models/detalleVenta.model');

const actualizarEstadoProductosVendidos = async () => {
  try {
    console.log('Iniciando actualización de productos vendidos...');

    // Obtener IDs únicos de productos que han sido vendidos
    const productosVendidos = await DetalleVenta.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('id_producto')), 'id_producto']
      ],
      raw: true
    });

    const idsProductosVendidos = productosVendidos.map(p => p.id_producto);

    if (idsProductosVendidos.length === 0) {
      console.log('No se encontraron productos para actualizar');
      process.exit(0);
    }

    // Actualizar todos los productos encontrados a estado vendido = true
    await Producto.update(
      { vendido: true },
      {
        where: {
          id_producto: idsProductosVendidos
        }
      }
    );

    console.log('¡Actualización completada!');
    console.log(`Se actualizaron ${idsProductosVendidos.length} productos a estado vendido`);
    console.log('IDs de productos actualizados:', idsProductosVendidos);

    process.exit(0);

  } catch (error) {
    console.error('Error al actualizar estado de productos vendidos:', error);
    process.exit(1);
  }
};

// Ejecutar la función
actualizarEstadoProductosVendidos();
