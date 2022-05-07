const { getLang } = require('../../../utils/functions/getData/getLang');
const { getArchive } = require('../../../utils/functions/getData/getArchive');
const { MessageEmbed } = require('discord.js');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const { delay } = require('../../../utils/functions/delay/delay');
const randomColor = require('randomcolor');

module.exports.run = async (bot, message, args) => {
    const lang = require(`../../../utils/assets/json/language/${await getLang(message.guild.id)}.json`);

    const hasPerms = await hasPermissions({
        user: message.member,
        needed_permission: {
            view_archiv: 1,
        }
    })

    if (!hasPerms) {
        return message.reply(lang.errors.noperms);
    }

	

	
}

module.exports.help = {
    name: "archiv",
    description: "View archived todo",
    usage: "archiv"
}