const database = require('../../../bot/db/db');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('../getData/getLang');
const config = require('../../assets/json/_config/config.json');

module.exports.updateLogChannel = async ({ guild_id, newLogChannel }) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    return await database
        .query(`UPDATE ${config.tables.mido_config} SET log_channel = ? WHERE guild_id = ?`, [
            newLogChannel,
            guild_id,
        ])
        .then(async () => {
            return {
                error: false,
                message: lang.settings.logChannel.updated,
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: lang.settings.logChannel.error,
            };
        });
};
