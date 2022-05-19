const config = require('../../assets/json/_config/config.json');
const { getFromCache } = require('../cache/cache');
const database = require('../../../bot/db/db');

module.exports.getPrefix = async function({guild_id}) {

    const prefixCache = await getFromCache({
        cacheName: 'config',
        param_id: guild_id,
    });

    if(prefixCache) return prefixCache[0].prefix;

    return await await database.query(`SELECT prefix FROM ${config.tables.mido_config} WHERE guild_id = ?`, guild_id)
    .then(res => {
        if(res === 0) {
            return config.defaultprefix;
        }else {
            return res[0].prefix;
        }
    }).catch(async err => {
        const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

        errorhandler(err, lang.errors.general, message.channel);
        return false;
    });
}