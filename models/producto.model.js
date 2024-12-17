const { DataTypes } = require('sequelize');
const db = require('../config/bd.config');

const Producto = db.define('Producto', {
  id_producto: {
    type: DataTypes.CHAR(5),
    primaryKey: true
  },
  id_categoria: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Categoria',
      key: 'id_categoria'
    }
  },
  id_marca: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Marca',
      key: 'id_marca'
    }
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  cantidad_total: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(255), // Campo para almacenar la URL de la imagen
    allowNull: true
  },
  stock_min: {
    type: DataTypes.INTEGER, // Campo para almacenar la URL de la imagen
    
  },
  vendido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'Producto',
  timestamps: false,
  hooks: {
    // Hook para generar el ID personalizado antes de crear un producto
    beforeCreate: async (producto, options) => {
      try {
        const lastProducto = await Producto.findOne({
          order: [['id_producto', 'DESC']]
        });

        let newId = 'P0001'; // ID inicial por defecto

        if (lastProducto) {
          // Obtener el último ID y generar el siguiente
          const lastIdNumber = parseInt(lastProducto.id_producto.substring(1), 10);
          newId = `P${(lastIdNumber + 1).toString().padStart(4, '0')}`;
        }

        producto.id_producto = newId; // Asignar el nuevo ID al producto

      } catch (error) {
        console.error("Error generando el ID del producto:", error);
        throw error;  // Lanza el error si algo falla en el hook
      }
    }
  }
});

Producto.associate = (models) => {
  Producto.belongsToMany(models.Proveedor, {
    through: models.ProveedorProducto,
    foreignKey: 'id_producto',
    otherKey: 'id_proveedor'
  });
};

module.exports = Producto;
