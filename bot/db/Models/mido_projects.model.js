const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoProjects extends Model {}

MidoProjects.init(
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

module.exports = MidoProjects;
