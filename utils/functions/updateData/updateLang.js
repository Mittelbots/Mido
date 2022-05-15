const database = require("../../../bot/db/db");
const config = require('../../assets/json/_config/config.json');
const { updateCache } = require("../cache/cache");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("../getData/getLang");

module.exports.updateLang = async ({guild_id, language}) => {

    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    return await database.query(`UPDATE ${config.tables.mido_config} SET lang = ? WHERE guild_id = ?`, [language, guild_id])
        .then(() => {
            updateCache({
                cacheName: "config",
                param_id: guild_id,
                value: {
                    lang: language
                }
            });
            return {
                error: false,
                message: lang.settings.lang.updated
            }
        })
        .catch(err => {
            errorhandler(err, null, null);
            return {
                error: true,
                message: lang.settings.lang.error
            }
        })
}