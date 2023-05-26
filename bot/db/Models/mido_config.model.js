const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoConfig extends Model {}

MidoConfig.init(
    {
        guild_id: {
            type: DataTypes.BIGINT,
            unique: 'guild_id',
        },
        lang: {
            type: DataTypes.STRING,
            defaultValue: 'en_EN',
        },
    },
    {
        sequelize: database,
        tableName: 'mido_config',
        timestamps: true,
    }
);

module.exports = MidoConfig;
