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

	const archive = await getArchive({
		channel: message.channel
	});
	
	if(!archive) return message.reply({
		content: 'Keine Aufgaben im Archiv'	
	}).then(async msg => {
		await delay(3000);
		msg.delete();
	})


	
	const archiveEmbed = new MessageEmbed()
		.setTitle(lang.archiv.title)
		.setColor(randomColor())
		
	archive.map(task => {
		archiveEmbed.addField(`${task.title} ||ID: ${task.id}||`, `
			${'\n '+task.text || lang.todo.no_text}
			\n ${lang.todo.deadline}: ${task.deadline || '**'+lang.todo.no_deadline+'**'}
			${lang.todo.reminder}: ${task.reminder ||  '**'+lang.todo.no_reminder+'**'}
			${lang.todo.other_user}: ${task.reminder ||  '**'+lang.todo.no_other_user+'**'}
			~~**------------------------------**~~
		`);
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