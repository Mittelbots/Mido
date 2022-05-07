const { SlashCommandBuilder } = require("@discordjs/builders")
const { hasPermissions } = require("../../../utils/functions/hasPermissions/hasPermissions")
const {
    getLang
} = require('../../../utils/functions/getData/getLang');
const { getArchive } = require("../../../utils/functions/getData/getArchive");
const { MessageEmbed } = require("discord.js");
const randomColor = require('randomcolor');


module.exports.run = async ({
    main_interaction,
    bot
}) => {

    const lang = require(`../../../utils/assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const isGuildArchive = JSON.parse(main_interaction.options.getString('isguild'));

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            view_user_archive: 1,
            view_guild_archive: (isGuildArchive) ? 1 : 0
        }
    })

    if(!hasPerms) {
        return main_interaction.reply({
            content: lang.errors.noperms,
            ephemeral: true
        })
    }

    

    const archive = await getArchive({
		channel: main_interaction.channel,
        isGuildArchive: isGuildArchive,
        user_id: main_interaction.member.id
	});
	
	if(!archive) return main_interaction.reply({
		content: 'Keine Aufgaben im Archiv',
        ephemeral: true
	})

	const archiveEmbed = new MessageEmbed()
		.setTitle(`${(isGuildArchive) ? lang.archiv.guild : lang.archiv.personal} - ${lang.archiv.title}`)
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
	
	return await main_interaction.reply({
		embeds: [archiveEmbed],
        ephemeral: (isGuildArchive) ? false : true
	});

}

module.exports.data = new SlashCommandBuilder()
	.setName('archive')
	.setDescription('See your guild or personal archive')
    .addStringOption(option =>
        option.setName('isguild')
        .setDescription('Do you want the guild archive?')
        .setRequired(true)
        .addChoices({
            name: 'Yes i want to see the guild archive',
            value: 'true'
        })
        .addChoices({
            name: 'No i want to see my personal archive',
            value: 'false'
        })
    )