const database = require("../../../bot/db/db");
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("./getLang");

module.exports.getConfig = async ({guild_id}) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    return await database.query(`SELECT * FROM ${config.tables.mido_config} WHERE guild_id = ?`, [guild_id])
        .then(res => {
            return {
                error: false,
                data: res[0]
            }
        })
        .catch(err => {
            errorhandler(err)
            return {
                error: true,
                message: lang.errors.fetching_config
            }
        })
}