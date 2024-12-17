const OrdenCompra = require('./ordenCompra.model');
const DetalleOrdenCompra = require('./detalleordencompra.model');
const Venta = require('./venta.model');
const DetalleVenta = require('./detalleVenta.model');
const Producto = require('./producto.model');
const Categoria = require('./categoria.model');
const Marca = require('./marca.model');
const Ubicacion = require('./ubicacion.model');
const InventarioUbicacion = require('./inventarioUbicacion.model');
const Proveedor = require('./proveedor.model');

// Establecer las asociaciones después de que ambos modelos están cargados
OrdenCompra.hasMany(DetalleOrdenCompra, {
  foreignKey: 'id_ordcompra',
  as: 'detalles'
});

DetalleOrdenCompra.belongsTo(OrdenCompra, {
  foreignKey: 'id_ordcompra',
  as: 'ordenCompra'
});
// Asociaciones Venta y DetalleVenta
Venta.hasMany(DetalleVenta, {
  foreignKey: 'id_venta',
  as: 'detalles'
});
DetalleVenta.belongsTo(Venta, {
  foreignKey: 'id_venta',
  as: 'ordenVenta'
});
DetalleVenta.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto'
});
Producto.hasMany(DetalleVenta, {
  foreignKey: 'id_producto',
  as: 'detallesVenta'
});

DetalleOrdenCompra.belongsTo(Producto, {
  foreignKey: 'id_producto',
  as: 'producto' // Alias que usaremos en la consulta
});
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });
Producto.belongsTo(Marca, { foreignKey: 'id_marca', as: 'marca' });
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' });
Marca.hasMany(Producto, { foreignKey: 'id_marca', as: 'productos' });

// Asociaciones para Ubicaciones
Ubicacion.belongsToMany(Producto, {
  through: InventarioUbicacion,
  foreignKey: 'id_ubicacion',
  otherKey: 'id_producto',
  as: 'productos'
});

Producto.belongsToMany(Ubicacion, {
  through: InventarioUbicacion,
  foreignKey: 'id_producto',
  otherKey: 'id_ubicacion',
  as: 'ubicaciones'
});
OrdenCompra.belongsTo(Proveedor, {
  foreignKey: 'id_proveedor',
  as: 'proveedor'
});
module.exports = {
  Categoria,
  Marca,
  OrdenCompra,
  DetalleOrdenCompra,
  Venta,
  DetalleVenta,
  Producto,
  Ubicacion,
  InventarioUbicacion
};
