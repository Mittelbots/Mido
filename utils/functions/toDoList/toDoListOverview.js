const {
    MessageEmbed
} = require("discord.js");
module.exports.newToDoEmbed = (title, text, deadline, other_user) => {
    const messageEmbed = new MessageEmbed()
        .setTitle('Dein neuer Task im Überblick.')
        .addField('Titel:', (title) ? title : 'Noch nicht gesetzt. (required)')
        .addField('Text:', (text) ? text : 'Noch nicht gesetzt. (required)')
        .addField('Deadline:', (deadline) ? deadline : 'Noch nicht gesetzt. (optional)')
        .addField('Andere Nutzer:', (other_user) ? other_user : 'Noch nicht gesetzt. (optional)')
        .setTimestamp()


    return messageEmbed;
}