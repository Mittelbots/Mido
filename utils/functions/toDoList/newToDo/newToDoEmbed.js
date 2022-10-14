const { EmbedBuilder } = require('discord.js');
module.exports.newToDoEmbed = (title, text, deadline, other_user) => {
    const embed = new EmbedBuilder()
        .setTitle('Dein neuer Task im Überblick.')
        .addFields([
            { name: 'Titel:', value: title ? title : 'Noch nicht gesetzt. (required)' },
            { name: 'Text:', value: text ? text : 'Noch nicht gesetzt. (required)' },
            { name: 'Deadline:', value: deadline ? deadline : 'Noch nicht gesetzt. (optional)' },
            {
                name: 'Anderer Benutzer:',
                value: other_user ? other_user : 'Noch nicht gesetzt. (optional)',
            },
        ])
        .setTimestamp();

    return embed;
};
