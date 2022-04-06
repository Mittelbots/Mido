const database = require('../../../bot/db/db');
const { toDoState_Deleted } = require('../../variables/variables');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('./getLang');
const config = require('../../assets/json/_config/config.json');

async function getToDo(channel, id) {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`)
    
    return await database.query(`SELECT * FROM ${config.tables.mido_todo} WHERE guild_id = ? ${(id) ? ' AND id = ? ' : ''}AND NOT state = ?`, [channel.guild.id, (id) ? id : '', toDoState_Deleted])
        .then(res => {
            if(res.length <= 0) return false;

            return res;
        })
        .catch(err => {
            errorhandler(err, lang.errors.general, channel);
            return false;
        });
}

module.exports = {getToDo};