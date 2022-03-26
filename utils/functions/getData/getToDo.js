const database = require('../../../bot/db/db');
const { toDoState_Deleted } = require('../../variables/variables');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('./getLang');

async function getToDo(channel) {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`)

    return await database.query('SELECT * FROM hn_todo WHERE NOT state = ?', toDoState_Deleted)
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