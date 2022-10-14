const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('../getData/getLang');

module.exports.updateToDo = async ({ guild_id, todo_id, data }) => {
    return await database
        .query(`UPDATE ${config.tables.mido_todo} SET ${data.column} = ? WHERE id = ?`, [
            data.data,
            todo_id,
        ])
        .then(() => {
            return {
                error: false,
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
            };
        });
};
