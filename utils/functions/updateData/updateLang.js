const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('../getData/getLang');

module.exports.updateLang = async ({ guild_id, language }) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    return await database
        .query(`UPDATE ${config.tables.mido_config} SET lang = ? WHERE guild_id = ?`, [
            language,
            guild_id,
        ])
        .then(async () => {
            return {
                error: false,
                message: lang.settings.lang.updated,
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: lang.settings.lang.error,
            };
        });
};
