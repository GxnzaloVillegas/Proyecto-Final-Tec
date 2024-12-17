const { DataTypes, CHAR } = require("sequelize");
const db = require("../config/bd.config");
const OrdenCompra = require("./ordenCompra.model");

const DetalleOrdenCompra = db.define(
  
  "DetalleOrdenCompra",
  {
    id_detcompra: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      
    },
    id_ordcompra: {
      type: DataTypes.STRING(15), 
      allowNull: false,
      references: {
        model: "OrdenCompra",
        key: "id_ordcompra",
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
    tableName: "DetalleOrdenCompra",
    timestamps: false,
  }
);

module.exports = DetalleOrdenCompra;
