const database = require("../../../bot/db/db");
const config = require('../../assets/json/_config/config.json');
const { getFromCache } = require("../cache/cache");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("./getLang");

module.exports.getConfig = async ({guild_id}) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    const configCache = await getFromCache({
        cacheName: "config",
        param_id: guild_id
    });

    if(configCache) return {
        error: false,
        data: configCache[0]
    }

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


module.exports.getAllConfig = async () => {
    return await database.query(`SELECT * FROM ${config.tables.mido_config}`)
        .then(res => {
            if(res.length === 0) return false;
            
            return res;
        })
        .catch(err => {
            console.log(err);
            return false;
        })
}