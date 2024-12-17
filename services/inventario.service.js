const InventarioUbicacion = require('../models/inventarioUbicacion.model');
const  Producto  = require('../models/producto.model');


exports.obtenerProductosPorUbicacion = async (id_ubicacion) => {
  try {
    const productos = await InventarioUbicacion.findAll({
      where: { id_ubicacion },
      include: {
        model: Producto,  // Incluimos el modelo Producto
        as: 'producto'   // Usamos el alias definido en las asociaciones
      }
    });
    
    return productos;
  } catch (error) {
    console.error('Error al obtener productos por ubicación:', error);
    throw new Error('No se pudieron obtener los productos para esta ubicación');
  }
};
