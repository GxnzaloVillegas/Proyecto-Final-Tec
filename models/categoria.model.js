const {DataTypes} = require('sequelize')
const db = require('../config/bd.config')

const Categoria = db.define('Categoria', {

    id_categoria: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        
    },
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    }
}, {
    tableName: 'Categoria',
    timestamps: false
});
module.exports = Categoria