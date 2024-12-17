const Categoria = require('../models/categoria.model')


// Obtener todos los clientes
exports.getAllCategoria = async () => {
    return Categoria.findAll();
}


// Crear un nuevo cliente
exports.createCategoria = async (catData) => {
  // Eliminar el id_cliente para que se genere en el hook 'beforeCreate'
  

  try {
      const nuevoCat = await Categoria.create(catData);
      return nuevoCat;
  } catch (error) {
      console.error('Error al crear el cliente:', error);
      throw error;  // Lanza el error para que sea manejado en el controlador
  }
};


// Obtener un cliente por su ID
exports.getCategoriaById = async (id) => {
    return await Categoria.findByPk(id);
  };
  
  // Actualizar un cliente
exports.updateCategoria = async (id, catData) => {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return null;
  
    return await categoria.update(catData);
  };
  