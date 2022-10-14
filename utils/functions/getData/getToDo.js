const database = require('../../../bot/db/db');
const { toDoState_Deleted, toDoState_Ready } = require('../../variables/variables');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('./getLang');
const config = require('../../assets/json/_config/config.json');

module.exports.getToDo = async (channel, id) => {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`);
    let sql;
    let args;

    if (id) {
        sql = `SELECT * FROM ${config.tables.mido_todo} WHERE guild_id = ? ${
            id ? ' AND id = ? ' : ''
        } AND NOT state = ?`;
        args = [channel.guild.id, id ? id : '', toDoState_Deleted];
    } else {
        sql = `SELECT * FROM ${config.tables.mido_todo} WHERE guild_id = ? AND NOT state = ?`;
        args = [channel.guild.id, toDoState_Deleted];
    }

    return await database
        .query(sql, args)
        .then((res) => {
            if (res.length <= 0) return false;

            return res;
        })
        .catch((err) => {
            errorhandler({ err, message: lang.errors.general, channel, fatal: true });
            return false;
        });
};

module.exports.getToDoByProjectId = async (guild_id, project_id) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    return await database
        .query(
            `SELECT * FROM ${config.tables.mido_todo} WHERE guild_id = ? AND cat_id = ? AND state = ?`,
            [guild_id, project_id, toDoState_Ready]
        )
        .then((res) => {
            if (res.length <= 0)
                return {
                    error: true,
                    message: 'No tasks found for this Project ID',
                };

            return {
                error: false,
                data: res,
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: lang.errors.general,
            };
        });
};
