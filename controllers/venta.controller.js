const ventaService = require('../services/venta.service');

const crearVenta = async (req, res) => {
  try {
    const { id_cliente, id_ubicacion, fecha, total, detalles } = req.body;

    // Validar que los detalles no estén vacíos
    if (!detalles || detalles.length === 0) {
      return res.status(400).json({ message: 'Debe incluir al menos un detalle de venta' });
    }

    // Crear la venta con los detalles
    const venta = await ventaService.crearVenta(
      { id_cliente, id_ubicacion, fecha, total },
      detalles
    );

    return res.status(201).json({ message: 'Venta creada con éxito', venta });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Listar todas las ventas
const listarVentas = async (req, res) => {
  try {
    const ventas = await ventaService.listarVentas();
    return res.status(200).json({ ventas });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Obtener una venta por su ID
const obtenerVentaPorId = async (req, res) => {
  try {
    const { idVenta } = req.params;
    const venta = await ventaService.obtenerVentaPorId(idVenta);

    if (!venta) {
      return res.status(404).json({ message: `Venta con ID ${idVenta} no encontrada` });
    }

    return res.status(200).json({ venta });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  crearVenta,
  listarVentas,
  obtenerVentaPorId
};
