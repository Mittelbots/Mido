const database = require("../../../bot/db/db");
const {
    errorhandler
} = require("../errorhandler/errorhandler");
const config = require('../../assets/json/_config/config.json');

var lang;

module.exports.getLang = async (guild_id) => {
    if (lang) return lang;
    else return this.getLangFromDatabase(guild_id);
}

module.exports.getLangFromDatabase = async (guild_id) => {
    return await database.query(`SELECT lang FROM ${config.tables.mido_config} WHERE guild_id = ?`, [guild_id])
        .then(res => {
            if (res === 0) {
                return 'en';
            } else {
                lang = res[0].lang;
                return lang;
            }
        }).catch(err => {
            errorhandler(err);
            return false;
        })
}


module.exports.changeLang = async (guild_id) => {

}