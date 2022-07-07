const { SlashCommandBuilder } = require("@discordjs/builders")
const { hasPermissions } = require("../../../utils/functions/hasPermissions/hasPermissions")
const {
    getLang
} = require('../../../utils/functions/getData/getLang');
const { getArchive } = require("../../../utils/functions/getData/getArchive");
const { MessageEmbed } = require("discord.js");
const randomColor = require('randomcolor');
const { getProject } = require("../../../utils/functions/getData/getProject");
const { MessageSelectMenu } = require("discord.js");
const { addSelectMenu } = require("../../../utils/functions/toDoList/addSelectMenu");
const { MessageActionRow } = require("discord.js");
const { delete_ready_todo } = require("../../../utils/variables/variables");


module.exports.run = async ({
    main_interaction,
    bot
}) => {

    const lang = require(`../../../utils/assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            edit_tasks: 1,
        }
    })

    if(!hasPerms) {
        return main_interaction.reply({
            content: lang.errors.noperms,
            ephemeral: true
        }).catch(err => {})
    }

    const projectEmbed = new MessageEmbed()
        .setTitle(lang.deltodo.embed_title)
        .setTimestamp()

    const projects = await getProject(main_interaction.channel);

    const selectMenu = new MessageSelectMenu()
        .setCustomId(delete_ready_todo)
        .setPlaceholder(lang.deltodo.select_placeholder)
        
        projects.map(prj => {
            selectMenu.addOptions([{
                'value': ''+prj.id,
                'label': prj.name,
                'description': lang.deltodo.embed_desc
            }])
        })

    main_interaction.reply({
        embeds: [projectEmbed],
        components: [new MessageActionRow({
            components: [selectMenu]
        })]
    })
}

module.exports.data = new SlashCommandBuilder()
	.setName('deltodo')
	.setDescription('Delete all your ready tasks at ones')