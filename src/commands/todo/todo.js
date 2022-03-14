const {
    MessageActionRow,
    MessageEmbed
} = require('discord.js');
const {
    getCategory
} = require('../../../utils/functions/getData/getCategory');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const {
    addSelectMenu
} = require('../../../utils/functions/toDoList/addSelecMenu');
const { select_catId, add_catId } = require('../../../utils/variables/variables');

module.exports.run = async (bot, message, args) => {
    if (!await hasPermissions(message.member)) {
        return message.reply('Du hast keine Berechtigung dafür. Falls dies falsch ist, kontaktiere den Discord Support.');
    }

    var categories = await getCategory(message.channel);

    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? 'Wähle ein neues Projekt aus.' : 'Füge zuerst ein neues Projekt hinzu.')
        .setTimestamp()

    var newMessageEmbedInteraction = await addSelectMenu(categories, select_catId, add_catId);
    await message.reply({
        embeds: [newMessageEmbed],
        components: [new MessageActionRow({
            components: [newMessageEmbedInteraction]
        })]
    }); 
    

    return;
}
module.exports.help = {
    name: "todo",
    description: "",
    usage: "todo"
}