const config = require('../../utils/assets/json/_config/config.json');

async function messageCreate(message, bot) {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.author.system) return;

    var messageArray = message.content.split(" ");
    
    var cmd = messageArray[0];
    var args = messageArray.slice(1);

    if (cmd.startsWith(config.defaultprefix)) {

        let commandfile = bot.commands.get(cmd.slice(config.defaultprefix.length));

        if (commandfile) { //&& blacklist(0, message)
            return commandfile.run(bot, message, args);
        } else {
            return;
        }

    }
}

module.exports = {
    messageCreate
}