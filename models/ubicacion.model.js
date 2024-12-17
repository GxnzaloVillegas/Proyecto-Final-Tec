const {DataTypes} = require('sequelize')
const db = require('../config/bd.config')

const Ubicacion = db.define('Ubicacion', {

    id_ubicacion: {
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nombre:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    descripcion:{
        type:DataTypes.TEXT,
        allowNull:false
    }
}, {
    tableName: 'Ubicacion',
    timestamps: false
});


module.exports = Ubicacion