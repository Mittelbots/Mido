const { MessageActionRow, MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("../getData/getLang");
const { refreshCategories_ToDo } = require("../getData/refreshCategories_ToDo");
const { addSelectMenu } = require("../toDoList/addSelecMenu");
module.exports.deleteProject = async (main_interaction, categories, isDelete) => {

    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`);

    if(!isDelete) {
        var newMessageEmbed = new MessageEmbed()
        .setTitle(lang.projects.choose_project_to_delete)
        .setDescription(lang.projects.choose_project_to_delete_warning)
        .setTimestamp()

        var newMessageEmbedInteraction = await addSelectMenu(categories, true, main_interaction.message.guild.id);
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
                    content: `${lang.success.deleted}!`
                }).then(async msg => {
                    await delay(3000);
                    msg.delete();

                    var newMessageEmbed = new MessageEmbed()
                    .setTitle((categories) ? lang.projects.choose_new_project : lang.projects.first_add_new_project)
                    .setTimestamp()
                    
                    const refresh = await refreshCategories_ToDo(main_interaction);
                    categories = refresh[0];

                    var newMessageEmbedInteraction = await addSelectMenu(categories, false, main_interaction.message.guild.id);
                    main_interaction.message.edit({
                        embeds: [newMessageEmbed],
                        components: [new MessageActionRow({
                            components: [newMessageEmbedInteraction]
                        })]
                    });
                })
            })
            .catch(err => {
                errorhandler(err, lang.projects.errors.error_at_delete);
            })
    }
}