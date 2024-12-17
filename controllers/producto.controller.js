const productoService = require('../services/producto.service');
const Producto = require('../models/producto.model');
const Proveedor = require('../models/proveedor.model');
const ProveedorProducto = require('../models/proveedorProducto.model');

const obtenerProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductos();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const obtenerProductoPorId = async (req, res) => {
  try {
    const producto = await productoService.obtenerProductoPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const crearProducto = async (req, res) => {
  try {
    const producto = await productoService.crearProducto(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarProducto = async (req, res) => {
  try {
    const producto = await productoService.actualizarProducto(req.params.id, req.body);
    res.status(200).json(producto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const eliminarProducto = async (req, res) => {
  try {
    await productoService.eliminarProducto(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const actualizarEstadoHistoricoVentas = async (req, res) => {
  try {
    const resultado = await productoService.actualizarEstadoProductosVendidos();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const obtenerProductosPorUbicacion = async (req, res) => {
  const { ubicacionId } = req.params; // Obtener el ID de ubicación de los parámetros de la solicitud
  try {
    const productos = await productoService.obtenerProductosPorUbicacion(ubicacionId);
    
    // Formatear la respuesta para incluir la cantidad
    const productosConCantidad = productos.map(item => ({
      id_producto: item.producto.id_producto,
      nombre: item.producto.nombre,
      precio: item.producto.precio,
      cantidad: item.cantidad, // Incluir la cantidad de InventarioUbicacion
    }));

    res.status(200).json(productosConCantidad);
  } catch (error) {
    console.error('Error al obtener productos por ubicación:', error);
    res.status(500).json({ message: 'Error al obtener productos por ubicación' });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarEstadoHistoricoVentas,
  obtenerProductosPorUbicacion,
};
