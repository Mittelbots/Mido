const { increase_currentSiteCount, decrease_currentSiteCount, decrease_toDoInteractionCount, getCurrentProjectId, changeCurrentProjectId } = require("../../../variables/variables");
const { editToDoList } = require("../editToDoList/editToDoList");
const { addButtons } = require('../addButtonsToList');
const { MessageActionRow } = require("discord.js");
const config = require("../../../assets/json/_config/config.json");

module.exports.buttonInteraction = async (params) => {

    var main_interaction = params.main_interaction;
    var projects = params.projects;
    var todo = params.todo;

    

    let currentSiteCount;
    
    //=========================================================

    if(main_interaction.customId.indexOf('optionsnext') !== -1) {
        currentSiteCount = increase_currentSiteCount();
        await editToDoList(projects, todo, main_interaction, false);
        return;
    }

    //=========================================================

    if(main_interaction.customId.indexOf('optionsbackSite') !== -1) {
        currentSiteCount = decrease_currentSiteCount();
        await editToDoList(projects, todo, main_interaction, false);
        return;
    }

    //=========================================================
    
    if(main_interaction.customId.indexOf('optionsbackToMain') !== -1) {
        if(!getCurrentProjectId()) changeCurrentProjectId(main_interaction.customId.split('_')[1])
        const buttons = await addButtons(main_interaction.message.guildId);
        main_interaction.message.edit({
            components: [new MessageActionRow({
                components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
            })]
        }).catch(err => {});
        return;
    }

    //=========================================================

    if(main_interaction.customId.indexOf('endint') !== -1) {
        if(!getCurrentProjectId()) changeCurrentProjectId(main_interaction.customId.split('_')[1])
        var comp = main_interaction.message.components[0].components
        for (let i in comp) {
            comp[i].setDisabled(true)
        }
        main_interaction.message.edit({
            components: [main_interaction.message.components[0]]
        });
        decrease_toDoInteractionCount();
        return;
    }

    //=========================================================
    if(main_interaction.customId.indexOf(config.buttons.add_toDo.customId) !== -1) {
        await require('../newToDo/addNewToDo')(main_interaction);
    }

    if(main_interaction.customId.indexOf(config.buttons.set_todo_ready.customId) !== -1) {
        await require('../set_toDo_ready/set_toDo_ready')({main_interaction})
    }

    if(main_interaction.customId.indexOf(config.buttons.delete_toDo.customId) !== -1) {
        await require('../delete_toDo/delete_toDo')({main_interaction})
    }

    if(main_interaction.customId.indexOf(config.buttons.options.customId) !== -1) {
        if(!getCurrentProjectId()) changeCurrentProjectId(main_interaction.customId.split('_')[1]);
        await require('../optionsButton/optionsButton')({main_interaction})
    }

    switch(main_interaction.customId) {
        case config.buttons.change_prod.customId:
            await require('../change_prod/change_prod')({main_interaction});
        break;

    }
}