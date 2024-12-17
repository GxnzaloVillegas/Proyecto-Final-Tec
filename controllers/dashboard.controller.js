const dashboardService = require('../services/dashboard.service');

exports.getTopSellingProducts = async (req, res) => {
  try {
    const { categoria, marca, startDate, endDate } = req.body;
    console.log('Filtros recibidos:', { categoria, marca, startDate, endDate });

    const filters = { 
      categoria: categoria ? categoria : undefined,
      marca: marca ? marca : undefined,
      startDate,
      endDate
    };
    console.log('Filtros procesados:', filters);

    const topProducts = await dashboardService.getTopSellingProducts(filters);
    console.log('Número de productos devueltos:', topProducts.length);

    res.json(topProducts);
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Error al obtener los productos más vendidos', error: error.message });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await dashboardService.getLowStockProducts();
    res.json(lowStockProducts);
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    res.status(500).json({ message: 'Error al obtener los productos con bajo stock' });
  }
};

exports.getSalesSummary = async (req, res) => {
  try {
    const salesSummary = await dashboardService.getSalesSummary();
    res.json(salesSummary);
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ message: 'Error al obtener el resumen de ventas' });
  }
};
