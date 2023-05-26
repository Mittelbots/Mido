const { Model, DataTypes } = require('sequelize');
const database = require('../db');

class MidoTasks extends Model {}

MidoTasks.init(
    {
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        deadline: {
            type: DataTypes.DATE,
        },
        other_user: {
            type: DataTypes.JSON,
        },
        category: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        state: {
            type: DataTypes.INTEGER,
        },
        reminder: {
            type: DataTypes.STRING,
        },
        guild_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    },
    {
        sequelize: database,
        tableName: 'mido_tasks',
        timestamps: true,
    }
);

module.exports = MidoTasks;
