const config = require('../../assets/json/_config/config.json');
const database = require('../../../bot/db/db');

module.exports.getPrefix = async function ({ guild_id }) {
    return await await database
        .query(`SELECT prefix FROM ${config.tables.mido_config} WHERE guild_id = ?`, guild_id)
        .then((res) => {
            if (res === 0) {
                return config.defaultprefix;
            } else {
                return res[0].prefix;
            }
        })
        .catch(async (err) => {
            const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

            errorhandler({
                err,
                channel: lang.errors.general,
                message: message.channel,
                fatal: true,
            });
            return false;
        });
};
