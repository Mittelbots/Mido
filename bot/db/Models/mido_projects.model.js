const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoConfig extends Model {}

MidoConfig.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        color: {
            type: DataTypes.CHAR(6),
            allowNull: false,
        },
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: 'mido_projects',
        timestamps: true,
    }
);

module.exports = MidoConfig;
