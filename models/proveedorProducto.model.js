const { DataTypes } = require('sequelize');
const db = require('../config/bd.config');

const ProveedorProducto = db.define('ProveedorProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_proveedor: {
    type: DataTypes.CHAR(5),
    allowNull: false,
    references: {
      model: 'Proveedor',
      key: 'id_proveedor'
    }
  },
  id_producto: {
    type: DataTypes.CHAR(5),
    allowNull: false,
    references: {
      model: 'Producto',
      key: 'id_producto'
    }
  },
  precio_proveedor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'ProveedorProducto',
  timestamps: false
});

ProveedorProducto.associate = (models) => {
  ProveedorProducto.belongsTo(models.Producto, { foreignKey: 'id_producto' });
  ProveedorProducto.belongsTo(models.Proveedor, { foreignKey: 'id_proveedor' });
};

module.exports = ProveedorProducto;
