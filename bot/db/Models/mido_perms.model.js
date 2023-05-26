const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoConfig extends Model {}

MidoConfig.init(
    {
        role_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        isTeam: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: 'mido_perms',
        timestamps: true,
    }
);

module.exports = MidoConfig;
