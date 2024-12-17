const Cliente = require('../models/cliente.model')


// Obtener todos los clientes
exports.getAllClientes = async () => {
    return Cliente.findAll();
}


// Crear un nuevo cliente
exports.createCliente = async (clienteData) => {
  // Eliminar el id_cliente para que se genere en el hook 'beforeCreate'
  delete clienteData.id_cliente;

  try {
      const nuevoCliente = await Cliente.create(clienteData);
      return nuevoCliente;
  } catch (error) {
      console.error('Error al crear el cliente:', error);
      throw error;  // Lanza el error para que sea manejado en el controlador
  }
};


// Obtener un cliente por su ID
exports.getClienteById = async (id) => {
    return await Cliente.findByPk(id);
};
  
// Actualizar un cliente
exports.updateCliente = async (id, clienteData) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) return null;
  
    return await cliente.update(clienteData);
};
  

// Eliminar un cliente
exports.deleteCliente = async (id) => {
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
        throw new Error('Cliente no encontrado');
    }
    
    try {
        await cliente.destroy();
        return { message: 'Cliente eliminado exitosamente' };
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        throw error;
    }
};
