const { DataTypes } = require('sequelize');
const db = require('../config/bd.config');

const OrdenCompra = db.define('OrdenCompra', {
  id_ordcompra: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    autoIncrement: false,
    allowNull: false
  },
  id_proveedor: {
    type: DataTypes.CHAR(5),
    allowNull: true,
    references: {
      model: 'Proveedor',
      key: 'id_proveedor'
    }
  },
  id_ubicacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Ubicacion',
      key: 'id_ubicacion'
    }
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: false
  }
}, {
  tableName: 'OrdenCompra',
  timestamps: false
});

module.exports = OrdenCompra;
