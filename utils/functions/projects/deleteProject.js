const {
    MessageActionRow,
    MessageEmbed
} = require("discord.js");
const database = require("../../../bot/db/db");
const { toDoState_Deleted, cancel_delete_project } = require("../../variables/variables");
const {
    delay
} = require("../delay/delay");
const {
    errorhandler
} = require("../errorhandler/errorhandler");
const {
    getLang
} = require("../getData/getLang");
const {
    refreshProject_ToDo
} = require("../getData/refreshProject_ToDo");
const {
    addSelectMenu, addConfirmMenu
} = require("../toDoList/addSelectMenu");
const config = require('../../assets/json/_config/config.json');

module.exports.deleteProject = async (main_interaction, categories, isDelete) => {

    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`);

    if (!isDelete) {
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
    } else {

        if(main_interaction.values[0] === cancel_delete_project) {
            var newMessageEmbed = new MessageEmbed()
            .setTitle((categories) ? lang.projects.choose_new_project : lang.projects.first_add_new_project)
            .setTimestamp()

            var newMessageEmbedInteraction = await addSelectMenu(categories, false, main_interaction.message.guild.id);
            main_interaction.message.edit({
                embeds: [newMessageEmbed],
                components: [new MessageActionRow({
                    components: [newMessageEmbedInteraction]
                })]
            });
            return;
        }
        const confirmSelectMenu = await addConfirmMenu();

        const confirmMessage = await main_interaction.message.channel.send({
            content: `Willst du das Projekt ${main_interaction.values[0]} wirklich löschen?`,
            components: [new MessageActionRow({
                components: [confirmSelectMenu]
            })]
        });

        const confirmCollector = await confirmMessage.createMessageComponentCollector({
            filter: (user) =>  user.user.id === main_interaction.user.id,
            max: 1
        });

        confirmCollector.on('collect', async confirm_interaction => {
            if (confirm_interaction.values[0] === 'no') {
                confirm_interaction.message.channel.send(`${lang.errors.canceled}`).then(async msg => {
                    await delay(2000);
                    msg.delete();
                    confirm_interaction.message.delete();

                    var newMessageEmbed = new MessageEmbed()
                        .setTitle(lang.projects.choose_new_project)
                        .setTimestamp()

                    var newMessageEmbedInteraction = await addSelectMenu(categories, false, main_interaction.message.guild.id);
                    return main_interaction.message.edit({
                        embeds: [newMessageEmbed],
                        components: [new MessageActionRow({
                            components: [newMessageEmbedInteraction]
                        })]
                    });
                })
                return;
            }else {
                const id = main_interaction.values[0].slice(4, main_interaction.values[0].length);
                return await database.query(`DELETE FROM ${config.tables.mido_projects} WHERE id = ?; UPDATE mido_todo SET state = ? WHERE cat_id = ?;`, [Number(id), toDoState_Deleted, Number(id)])
                    .then(async () => {
                        await main_interaction.channel.send({
                            content: `${lang.success.deleted}!`
                        }).then(async msg => {
                            await delay(3000);
                            msg.delete();
                        });
        
                        const refresh = await refreshProject_ToDo(main_interaction);
                        categories = refresh[0];
        
                        var newMessageEmbed = new MessageEmbed()
                            .setTitle((categories) ? lang.projects.choose_new_project : lang.projects.first_add_new_project)
                            .setTimestamp()
        
                        var newMessageEmbedInteraction = await addSelectMenu(categories, false, main_interaction.message.guild.id);
                        return main_interaction.message.edit({
                            embeds: [newMessageEmbed],
                            components: [new MessageActionRow({
                                components: [newMessageEmbedInteraction]
                            })]
                        });
                    })
                    .catch(err => {
                        return errorhandler(err, lang.projects.errors.error_at_delete, main_interaction.message.channel);
                    });
            }
        })
    }
}