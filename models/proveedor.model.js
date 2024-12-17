const { DataTypes } = require('sequelize');
const db = require('../config/bd.config');

const Proveedor = db.define('Proveedor', {
  id_proveedor: {
    type: DataTypes.CHAR(5),
    primaryKey: true
  },
  raz_soc: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  dir_pro: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tel_pro: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  ruc: {
    type: DataTypes.CHAR(11),
    allowNull: false
  }
}, {
  tableName: 'Proveedor',
  timestamps: false,
  hooks: {
    beforeCreate: async (proveedor) => {
      try {
        const lastProveedor = await Proveedor.findOne({
          order: [['id_proveedor', 'DESC']],
          raw: true
        });

        let nextId;
        if (lastProveedor && lastProveedor.id_proveedor) {
          // Extraer el número y asegurarse de que sea un número válido
          const match = lastProveedor.id_proveedor.match(/PV(\d+)/);
          if (match) {
            const lastNumber = parseInt(match[1], 10);
            nextId = `PV${String(lastNumber + 1).padStart(3, '0')}`;
          } else {
            nextId = 'PV001';
          }
        } else {
          nextId = 'PV001';
        }

        // Verificar si el ID generado ya existe
        const existingProveedor = await Proveedor.findOne({
          where: { id_proveedor: nextId }
        });

        if (existingProveedor) {
          // Si existe, genera el siguiente número disponible
          let counter = parseInt(nextId.slice(2), 10) + 1;
          while (await Proveedor.findOne({ 
            where: { id_proveedor: `PV${String(counter).padStart(3, '0')}` }
          })) {
            counter++;
          }
          nextId = `PV${String(counter).padStart(3, '0')}`;
        }

        proveedor.id_proveedor = nextId;
      } catch (error) {
        console.error('Error generando ID:', error);
        throw new Error('Error al generar ID de proveedor');
      }
    }
  }
});

Proveedor.associate = (models) => {
  Proveedor.belongsToMany(models.Producto, {
    through: models.ProveedorProducto,
    foreignKey: 'id_proveedor',
    otherKey: 'id_producto'
  });
};

module.exports = Proveedor;
