const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const { getLang } = require('../../utils/functions/getData/getLang');
const { getIgnoreMode } = require('../../utils/functions/getData/getIgnoreMode');
const { isUserPremium } = require('../../utils/functions/premium/premium');
const { delay } = require('../../utils/functions/delay/delay');
const { getPrefix } = require('../../utils/functions/getData/getPrefix');

async function messageCreate(message, bot) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.author.system) return;

    var messageArray = message.content.split(" ");
    
    var cmd = messageArray[0];
    var args = messageArray.slice(1);

    const prefix = await getPrefix({
        guild_id: message.guild.id
    })

    if (cmd.startsWith(prefix)) {

        const isIgnoreMode = await getIgnoreMode();

        if(isIgnoreMode.error) {
            errorhandler(isIgnoreMode.message);
            const lang = require(`../../utils/assets/json/language/${await getLang(message.guild.id)}.json`)
            message.reply({
                content: lang.errors.general
            }).then(async msg => {
                await delay(5000);
                msg.delete().catch(err => {}).catch(err => {})
            }).catch(err => {})
        }
    
        if(isIgnoreMode.ignoreMode) {
            const lang = require(`../../utils/assets/json/language/${await getLang(message.guild.id)}.json`)
            return message.reply({
                content: lang.errors.ignoreModeOn
            }).then(async msg => {
                await delay(5000);
                msg.delete().catch(err => {})
            }).catch(err => {})
        }

        let commandfile = bot.commands.get(cmd.slice(prefix.length));

        if (commandfile) { //&& blacklist(0, message)
            
            const isPremium = isUserPremium({
                user_id: message.author.id
            });

            if(isPremium.error) return message.reply({
                content: isPremium.message
            });

            return commandfile.run(bot, message, args, isPremium.premium, isPremium.platin);
        } else return;

    }
}

module.exports = {
    messageCreate
}