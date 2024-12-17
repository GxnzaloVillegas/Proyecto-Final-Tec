const {DataTypes} = require('sequelize')
const db = require('../config/bd.config');
const Producto = require('./producto.model');

const InventarioUbicacion = db.define('InventarioUbicacion', {

    id_invubicacion: {
        type:DataTypes.INTEGER,
        primaryKey: true
    },
    id_producto: {
        type:DataTypes.CHAR(5),
        allowNull: true,
        references: {
      model: 'Producto',
      key: 'id_producto'
    }
    },  
    id_ubicacion: {
        type:DataTypes.INTEGER,
        allowNull: true,
       references: {
      model: 'Ubicacion',
      key: 'id_ubicacion'
    }
    },
    cantidad:{
        type:DataTypes.INTEGER,
        allowNull:false
    }
}, {
    tableName: 'InventarioUbicacion',
    timestamps: false
});
// Definimos la asociación con Producto
InventarioUbicacion.belongsTo(Producto, {
    foreignKey: 'id_producto',
    as: 'producto'
  });
  
  module.exports = InventarioUbicacion;