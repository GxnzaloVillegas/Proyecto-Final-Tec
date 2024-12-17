const { DataTypes } = require('sequelize');
const db = require('../config/bd.config');

const Venta = db.define('Venta', {
  id_venta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
    
  },
  id_cliente: {
    type: DataTypes.CHAR(5),
    allowNull: true,
    references: {
      model: 'Cliente',
      key: 'id_cliente'
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
  }
}, {
  tableName: 'Venta',
  timestamps: false
});

module.exports = Venta;
