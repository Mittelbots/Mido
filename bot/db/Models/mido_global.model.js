const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoGlobal extends Model {}

MidoGlobal.init(
    {
        ignoreMode: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize: database,
        tableName: 'mido_global',
        timestamps: true,
    }
);

module.exports = MidoGlobal;
