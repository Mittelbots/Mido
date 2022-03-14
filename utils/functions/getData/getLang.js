const database = require("../../../bot/db/db");
const { errorhandler } = require("../errorhandler/errorhandler");

module.exports.getLang = async (guild_id) => {
    return await database.query(`SELECT lang FROM hn_config WHERE guild_id = ?`, [guild_id])
        .then(res => {
            if(res === 0) {
                return 'en';
            }else {
                return res[0].lang;
            }
        }).catch(err => {
            console.log(err);
            errorhandler(err);
            return false;
        })
}