const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoConfig extends Model {}

MidoConfig.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        lang: {
            type: DataTypes.STRING,
            defaultValue: 'en_EN',
        },
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: 'mido_config',
        timestamps: true,
    }
);

module.exports = MidoConfig;
