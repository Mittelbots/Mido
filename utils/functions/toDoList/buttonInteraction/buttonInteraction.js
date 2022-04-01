const { increase_currentSiteCount, decrease_currentSiteCount } = require("../../../variables/variables");
const { editToDoList } = require("../editToDoList/editToDoList");
const { addButtons } = require('../addButtonsToList');
const { MessageActionRow } = require("discord.js");

module.exports.buttonInteraction = async (params) => {

    var main_interaction = params.main_interaction;
    var projects = params.projects;
    var todo = params.todo;
    var currentCatId = params.currentCatId;
    var toDoCountInteraction = params.toDoCountInteraction;

    let currentSiteCount;

    if(main_interaction.customId.indexOf('options_next') !== -1) {
        currentSiteCount = increase_currentSiteCount();
        await editToDoList(projects, todo, main_interaction, false);
    }
    if(main_interaction.customId.indexOf('options_back') !== -1) {
        currentSiteCount = decrease_currentSiteCount();
        await editToDoList(projects, todo, main_interaction, false);
    }
    if(main_interaction.customId.indexOf('options_backToMain') !== -1) {
        const buttons = await addButtons(main_interaction.message.guildId);
        main_interaction.message.edit({
            components: [new MessageActionRow({
                components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
            })]
        }).catch(err => {})
    }
    if(main_interaction.customId.indexOf('end_int') !== -1) {
        var comp = main_interaction.message.components[0].components
        for (let i in comp) {
            comp[i].setDisabled(true)
        }
        main_interaction.message.edit({
            components: [main_interaction.message.components[0]]
        });
        toDoCountInteraction = 0;
    }
}