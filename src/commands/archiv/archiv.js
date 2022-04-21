const { getLang } = require('../../../utils/functions/getData/getLang');
const { getArchive } = require('../../../utils/functions/getData/getArchive');
const { MessageEmbed } = require('discord.js');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');

module.exports.run = async (bot, message, args) => {
    const lang = require(`../../../utils/assets/json/language/${await getLang(message.guild.id)}.json`);

    if (!await hasPermissions(message.member)) {
        return message.reply(lang.errors.noperms);
    }

	const archive = await getArchive(message.channel);
	
	if(!archive) return message.reply({
		content: 'Keine Aufgaben im Archiv'	
	}).then(async msg => {
		//await delay(3000);
		msg.delete();
	})
	
	const archiveEmbed = new MessageEmbed();
	
	archive.map(task => {
		archiveEmbed.addField(task.title, task.text);
	});
	
	return await message.reply({
		embeds: [archiveEmbed]
	});

	
}

module.exports.help = {
    name: "archiv",
    description: "View archived todo",
    usage: "archiv"
}