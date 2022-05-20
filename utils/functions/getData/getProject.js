const database = require('../../../bot/db/db');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('./getLang');
const config = require('../../assets/json/_config/config.json')

async function getProject(channel) {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`)

    return await database.query(`SELECT * FROM ${config.tables.mido_projects} WHERE guild_id = ?`, [channel.guild.id])
        .then(res => {
            if(res.length <= 0) return false;

            return res;
        })
        .catch(err => {
            errorhandler({err, message: lang.errors.general, channel, fatal: true});
            return false;
        });
}

module.exports = {getProject};