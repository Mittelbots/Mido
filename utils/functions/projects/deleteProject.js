const { MessageActionRow, MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { refreshCategories_ToDo } = require("../getData/refreshCategories_ToDo");
const { addSelectMenu } = require("../toDoList/addSelecMenu");

module.exports.deleteProject = async (main_interaction, categories, isDelete) => {
    if(!isDelete) {
        var newMessageEmbed = new MessageEmbed()
        .setTitle('Wähle die gewünschte Kategorie aus um diese zu löschen!')
        .setDescription('ACHTUNG! Dieser Vorgang kann nicht zurückgesetzt werden.')
        .setTimestamp()

        var newMessageEmbedInteraction = await addSelectMenu(categories, true);
        main_interaction.message.edit({
            embeds: [newMessageEmbed],
            components: [new MessageActionRow({
                components: [newMessageEmbedInteraction]
            })]
        });
    }else {
        const id = main_interaction.values[0].slice(4,main_interaction.values[0].length);
        return await database.query('DELETE FROM hn_category WHERE id = ?; DELETE FROM hn_todo WHERE cat_id = ?;', [Number(id), Number(id)])
            .then(() => {
                return main_interaction.channel.send({
                    content: 'Erfolgreich gelöscht'
                }).then(async msg => {
                    await delay(3000);
                    msg.delete();

                    var newMessageEmbed = new MessageEmbed()
                    .setTitle((categories) ? 'Wähle ein neues Projekt aus.' : 'Füge zuerst ein neues Projekt hinzu.')
                    .setTimestamp()
                    
                    const refresh = await refreshCategories_ToDo(main_interaction);
                    categories = refresh[0];

                    var newMessageEmbedInteraction = await addSelectMenu(categories, false);
                    main_interaction.message.edit({
                        embeds: [newMessageEmbed],
                        components: [new MessageActionRow({
                            components: [newMessageEmbedInteraction]
                        })]
                    });
                })
            })
            .catch(err => {
                errorhandler(err, 'Fehler beim löschen!')
            })
    }
}