const { DataTypes } = require('sequelize');
const db = require('../config/bd.config');

const Cliente = db.define('Cliente', {
  id_cliente: {
    type: DataTypes.CHAR(5),
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
    
  },
  apepaterno: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  apematerno: {
    type: DataTypes.STRING(50),
    allowNull: false
    
  },
  dni: {
    type: DataTypes.CHAR(8),
    allowNull: false
  },
  dir_cli: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tel_cli: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'Cliente',
  timestamps: false,
  hooks: {
    // Hook para generar el ID personalizado antes de crear un cliente
    beforeCreate: async (cliente, options) => {
      try {
        const lastCliente = await Cliente.findOne({
          order: [['id_cliente', 'DESC']]
        });

        let newId = 'C0001'; // ID inicial por defecto

        if (lastCliente) {
          // Obtén el último ID y genera el siguiente
          const lastIdNumber = parseInt(lastCliente.id_cliente.substring(1), 10);
          newId = `C${(lastIdNumber + 1).toString().padStart(4, '0')}`;
        }

        cliente.id_cliente = newId; // Asignar el nuevo ID al cliente

      } catch (error) {
        console.error("Error generando el ID del cliente:", error);
        throw error;  // Lanza el error si algo falla en el hook
      }
    }
  }
});

module.exports = Cliente;
