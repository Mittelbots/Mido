const { SlashCommandBuilder } = require('@discordjs/builders');

const {
    MessageActionRow,
    MessageEmbed
} = require('discord.js');
const {
    delay
} = require('../../../utils/functions/delay/delay');
const {
    getProject
} = require('../../../utils/functions/getData/getProject');
const {
    getLang
} = require('../../../utils/functions/getData/getLang');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const {
    removeMention
} = require('../../../utils/functions/removeCharacters/removeCharacters');
const {
    addSelectMenu
} = require('../../../utils/functions/toDoList/addSelectMenu');
const {
    viewUserToDo
} = require('../../../utils/functions/toDoList/viewUserToDo');

module.exports.run = async ({main_interaction, bot}) => {

    const lang = require(`../../../utils/assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            view_tasks: 1,
        }
    })

    if (!hasPerms) {
        return main_interaction.reply({
            content: lang.errors.noperms,
            ephemeral: true
        });
    }

    var value = main_interaction.options.getUser('user');
    if (value) {
        try {
            value = removeMention(value);
            main_interaction.guild.members.cache.find(member => member.id.includes(value));
        } catch (err) {
            return main_interaction.reply({
                content: lang.errors.user_notfound,
                ephemeral: true
            }).then(async msg => {
                await delay(2000);
                msg.delete().catch(err => {})
            })

        }

        const embed = await viewUserToDo(value, main_interaction.guild.id, main_interaction.channel);
        if (!embed) {
            return main_interaction.reply({
                content: lang.todo.no_active_todo,
                ephemeral: true
            })
        } else {
            return main_interaction.reply({
                embeds: [embed]
            }).catch(err => {})
        }
    }
    var categories = await getProject(main_interaction.channel);

    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? lang.projects.choose_new_project : lang.projects.first_add_new_project)
        .setTimestamp()

    var newMessageEmbedInteraction = await addSelectMenu(main_interaction, categories, false, main_interaction.guild.id);
    
    return await main_interaction.reply({
        embeds: [newMessageEmbed],
        components: [new MessageActionRow({
            components: [newMessageEmbedInteraction]
        })]
    })
}


module.exports.data = new SlashCommandBuilder()
    .setName('todo')
    .setDescription('Manage your tasks with this command.')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('Use this option to see others tasks.')
            .setRequired(false)
    )
