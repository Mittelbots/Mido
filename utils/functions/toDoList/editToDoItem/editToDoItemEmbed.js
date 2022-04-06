const {
    MessageEmbed
} = require("discord.js");
module.exports.editToItemEmbed = (title, text, deadline, other_user, toDoItemId) => {
    const messageEmbed = new MessageEmbed()
        .setTitle('Dein existierende Task im Überblick. ID: ' + toDoItemId)
        .addField('Titel:', (title) ? title : 'Noch nicht gesetzt. (required)')
        .addField('Text:', (text) ? text : 'Noch nicht gesetzt. (required)')
        .addField('Deadline:', (deadline) ? deadline : 'Noch nicht gesetzt. (optional)')
        .addField('Andere Nutzer:', (other_user) ? other_user : 'Noch nicht gesetzt. (optional)')
        .setTimestamp()


    return messageEmbed;
}