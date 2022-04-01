const {
    MessageActionRow,
    MessageEmbed
} = require('discord.js');
const { delay } = require('../../../utils/functions/delay/delay');
const {
    getProject
} = require('../../../utils/functions/getData/getProject');
const { getLang } = require('../../../utils/functions/getData/getLang');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const { removeMention } = require('../../../utils/functions/removeCharacters/removeCharacters');
const {
    addSelectMenu
} = require('../../../utils/functions/toDoList/addSelectMenu');
const { viewUserToDo } = require('../../../utils/functions/toDoList/viewUserToDo');

module.exports.run = async (bot, message, args) => {

    const lang = require(`../../../utils/assets/json/language/${await getLang(message.guild.id)}.json`)

    if (!await hasPermissions(message.member)) {
        return message.reply(lang.errors.noperms);
    }

    var value = args[0];
    if(value) {
        try {
            value = removeMention(value);
            message.guild.members.cache.find(member => member.id.includes(value));
        }catch(err) {
            return message.reply({
                content: lang.errors.user_notfound
            }).then(async msg => {
                await delay(2000);
                msg.delete();
            })

        }

        const embed = await viewUserToDo(value, message.guild.id, message.channel);
        if(!embed) {
            return message.reply({
                content: lang.todo.no_active_todo
            }).then(async msg => {
                await delay(3000);
                msg.delete();
                message.delete();
            })
        }else {
            return message.reply({
                embeds: [embed]
            });
        }
    }
    var categories = await getProject(message.channel);

    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? lang.projects.choose_new_project : lang.projects.first_add_new_project)
        .setTimestamp()

    var newMessageEmbedInteraction = await addSelectMenu(categories, false, message.guild.id);
    return await message.reply({
        embeds: [newMessageEmbed],
        components: [new MessageActionRow({
            components: [newMessageEmbedInteraction]
        })]
    }); 
}

module.exports.help = {
    name: "todo",
    description: "todo [ID/@mention]",
    usage: "todo"
}