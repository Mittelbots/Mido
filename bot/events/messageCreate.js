const config = require('../../utils/assets/json/_config/config.json');
const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const { getLang } = require('../../utils/functions/getData/getLang');
const database = require('../db/db');

async function messageCreate(message, bot) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.author.system) return;

    var messageArray = message.content.split(" ");
    
    var cmd = messageArray[0];
    var args = messageArray.slice(1);

    const prefix = await database.query(`SELECT prefix FROM ${config.tables.mido_config} WHERE guild_id = ?`, message.guild.id)
    .then(res => {
        if(res === 0) {
            return config.defaultprefix;
        }else {
            return res[0].prefix;
        }
    }).catch(async err => {
        const lang = require(`../../../utils/assets/json/language/${await getLang(message.guild.id)}.json`)

        errorhandler(err, lang.errors.general, message.channel);
        return false;
    });

    if(!prefix) return;

    if (cmd.startsWith(prefix)) {
        let commandfile = bot.commands.get(cmd.slice(prefix.length));

        if (commandfile) { //&& blacklist(0, message)
            return commandfile.run(bot, message, args);
        } else return;

    }
}

module.exports = {
    messageCreate
}