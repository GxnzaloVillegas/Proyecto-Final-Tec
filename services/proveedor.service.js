const  Proveedor  = require('../models/proveedor.model');

// Obtener todos los proveedores
const obtenerProveedores = async () => {
  try {
    const proveedores = await Proveedor.findAll();
    return proveedores;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

// Obtener proveedor por ID
const obtenerProveedorPorId = async (id_proveedor) => {
  try {
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor) {
      throw new Error('Proveedor no encontrado');
    }
    return proveedor;
  } catch (error) {
    console.error('Error al obtener proveedor por ID:', error);
    throw error;
  }
};

// Crear un nuevo proveedor
const crearProveedor = async (data) => {
  try {
    const nuevoProveedor = await Proveedor.create(data);
    return nuevoProveedor;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    throw error;
  }
};

// Actualizar un proveedor
const actualizarProveedor = async (id_proveedor, data) => {
  try {
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor) {
      throw new Error('Proveedor no encontrado');
    }
    await proveedor.update(data);
    return proveedor;
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    throw error;
  }
};

// Eliminar un proveedor
const eliminarProveedor = async (id_proveedor) => {
  try {
    const proveedor = await Proveedor.findByPk(id_proveedor);
    if (!proveedor) {
      throw new Error('Proveedor no encontrado');
    }
    await proveedor.destroy();
    return { message: 'Proveedor eliminado con éxito' };
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    throw error;
  }
};

module.exports = {
  obtenerProveedores,
  obtenerProveedorPorId,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
};
