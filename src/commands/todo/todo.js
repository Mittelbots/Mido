const {
    MessageActionRow,
    MessageEmbed
} = require('discord.js');
const {
    getCategory
} = require('../../../utils/functions/getData/getCategory');
const {
    getToDo
} = require('../../../utils/functions/getData/getToDo');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const {
    addSelectMenu
} = require('../../../utils/functions/toDoList/addSelecMenu');

module.exports.add_catId = 'add_cat';
module.exports.select_catId = 'select_cat';

module.exports.run = async (bot, message, args) => {
    if (!await hasPermissions(message.member)) {
        return message.reply('Du hast keine Berechtigung dafür.');
    }

    var todo = await getToDo(message.channel);
    var categories = await getCategory(message.channel);

    if (!todo) return message.channel.send('Keine To-Do Liste in der Datenbank.');

    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? 'Wähle eine neue Kategorie aus.' : 'Füge zuerst eine neue Kategorie hinzu.')
        .setTimestamp()



    var newMessageEmbedInteraction = new MessageActionRow()
        .addComponents(addSelectMenu(categories, this.select_catId, this.add_catId))

    message.reply({
        embeds: [newMessageEmbed],
        components: [newMessageEmbedInteraction]
    });

    
}
module.exports.help = {
    name: "todo",
    description: "",
    usage: "todo"
}