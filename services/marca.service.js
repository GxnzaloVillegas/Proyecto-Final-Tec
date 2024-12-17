const Marca = require('../models/marca.model')


// Obtener todos los clientes
exports.getAllMarca = async () => {
    return Marca.findAll();
}


// Crear un nuevo cliente
exports.createMarca = async (catData) => {
  // Eliminar el id_cliente para que se genere en el hook 'beforeCreate'
  

  try {
      const nuevoMarca = await Marca.create(catData);
      return nuevoMarca;
  } catch (error) {
      console.error('Error al crear el cliente:', error);
      throw error;  // Lanza el error para que sea manejado en el controlador
  }
};


// Obtener un cliente por su ID
exports.getMarcaById = async (id) => {
    return await Marca.findByPk(id);
  };
  
  // Actualizar un cliente
exports.updateMarca = async (id, catData) => {
    const marca = await Marca.findByPk(id);
    if (!marca) return null;
  
    return await marca.update(catData);
  };
  