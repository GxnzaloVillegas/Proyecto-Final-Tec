const proveedorService = require('../services/proveedor.service');

// Obtener todos los proveedores
const obtenerProveedores = async (req, res) => {
  try {
    const proveedores = await proveedorService.obtenerProveedores();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener proveedores', error: error.message });
  }
};

// Obtener un proveedor por ID
const obtenerProveedorPorId = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const proveedor = await proveedorService.obtenerProveedorPorId(id_proveedor);
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(404).json({ message: 'Proveedor no encontrado', error: error.message });
  }
};

// Crear un nuevo proveedor
const crearProveedor = async (req, res) => {
  try {
    const nuevoProveedor = await proveedorService.crearProveedor(req.body);
    res.status(201).json(nuevoProveedor);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear proveedor', error: error.message });
  }
};

// Actualizar un proveedor
const actualizarProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    const proveedorActualizado = await proveedorService.actualizarProveedor(id_proveedor, req.body);
    res.status(200).json(proveedorActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar proveedor', error: error.message });
  }
};

// Eliminar un proveedor
const eliminarProveedor = async (req, res) => {
  try {
    const { id_proveedor } = req.params;
    await proveedorService.eliminarProveedor(id_proveedor);
    res.status(200).json({ message: 'Proveedor eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar proveedor', error: error.message });
  }
};

module.exports = {
  obtenerProveedores,
  obtenerProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};
