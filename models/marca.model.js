const {DataTypes} = require('sequelize')
const db = require('../config/bd.config')

const Marca = db.define('Marca', {

    id_marca: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type:DataTypes.STRING(50),
        allowNull:false
    }
}, {
    tableName: 'Marca',
    timestamps: false
});
module.exports = Marca