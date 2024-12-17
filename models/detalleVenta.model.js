const { DataTypes, CHAR } = require("sequelize");
const db = require("../config/bd.config");

const DetalleVenta = db.define("DetalleVenta",
  {
    id_detventa: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Venta",
        key: "id_venta",
      },
    },
    id_producto: {
      type: DataTypes.CHAR(5),
      allowNull: false,
      references: {
        model: "Producto",
        key: "id_producto",
      },
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pre_unitario: {
     type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "DetalleVenta",
    timestamps: false,
  }
);

module.exports = DetalleVenta;
