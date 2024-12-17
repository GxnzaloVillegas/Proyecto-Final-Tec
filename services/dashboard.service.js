const { Sequelize, Op } = require('sequelize');
const { Venta, DetalleVenta } = require('../models');
const Producto = require('../models/producto.model');
const Categoria = require('../models/categoria.model');
const Marca = require('../models/marca.model');
exports.getTopSellingProducts = async (filters = {}) => {
  const { categoria, marca, startDate, endDate } = filters;
  let whereClause = {};
  let dateWhereClause = {};

  if (categoria) {
    whereClause['$producto.id_categoria$'] = parseInt(categoria);
  }
  if (marca) {
    whereClause['$producto.id_marca$'] = parseInt(marca);
  }
  
  if (startDate && endDate) {
    dateWhereClause = {
      fecha: {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      }
    };
  }

  console.log('Filtros aplicados:', { whereClause, dateWhereClause });

  try {
    const topProducts = await DetalleVenta.findAll({
      attributes: [
        [Sequelize.col('producto.id_producto'), 'id_producto'],
        [Sequelize.col('producto.nombre'), 'nombre'],
        [Sequelize.fn('SUM', Sequelize.col('DetalleVenta.cantidad')), 'cantidad_total'],
        [Sequelize.fn('SUM', Sequelize.literal('DetalleVenta.cantidad * DetalleVenta.pre_unitario')), 'venta_total']
      ],
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: [],
          required: true,
          include: [
            {
              model: Categoria,
              as: 'categoria',
              attributes: []
            },
            {
              model: Marca,
              as: 'marca',
              attributes: []
            }
          ]
        },
        {
          model: Venta,
          as: 'ordenVenta',
          attributes: [],
          required: true,
          where: dateWhereClause
        }
      ],
      where: whereClause,
      group: ['producto.id_producto', 'producto.nombre'],
      order: [[Sequelize.literal('cantidad_total'), 'DESC']],
      raw: true,
      nest: true,
      logging: console.log // Esto imprimirá la consulta SQL en la consola
    });

    console.log('Número de productos encontrados:', topProducts.length);

    return topProducts.map(product => ({
      ...product,
      cantidad_total: parseInt(product.cantidad_total),
      venta_total: parseFloat(product.venta_total).toFixed(2)
    }));
  } catch (error) {
    console.error('Error en getTopSellingProducts:', error);
    throw error;
  }
};

exports.getLowStockProducts = async () => {
  const lowStockProducts = await Producto.findAll({
    where: Sequelize.literal('cantidad_total <= stock_min'),
    attributes: ['id_producto', 'nombre', 'cantidad_total', 'stock_min'],
    order: [['cantidad_total', 'ASC']],
    limit: 10
  });

  return lowStockProducts;
};

exports.getSalesSummary = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [dailySales, weeklySales, monthlySales] = await Promise.all([
    Venta.sum('total', { where: { fecha: { [Op.gte]: today } } }),
    Venta.sum('total', { where: { fecha: { [Op.gte]: weekStart } } }),
    Venta.sum('total', { where: { fecha: { [Op.gte]: monthStart } } })
  ]);

  return {
    today: dailySales || 0,
    week: weeklySales || 0,
    month: monthlySales || 0
  };
};
