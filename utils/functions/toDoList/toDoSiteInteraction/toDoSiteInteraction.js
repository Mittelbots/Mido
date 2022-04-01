const { MessageActionRow } = require("discord.js");
const { refreshProject_ToDo } = require("../../getData/refreshProject_ToDo");
const { addButtons } = require("../addButtonsToList");


module.exports = async (todo_item_interaction, main_interaction, lang, todolist, toDoCountInteraction) => {
    const optionsCollector = await todolist.createMessageComponentCollector({
        filter: ((user) => user.user.id === main_interaction.user.id)
    });

    optionsCollector.on('collect', async options_interaction => {
        switch(options_interaction.customId) {
            case 'options_backToMain':
                
                break;
            
            // case 'options_next':
            //     const refresh = refreshProject_ToDo(main_interaction);
            //     const viewToDoList = await viewToDoList(refresh[0], refresh[1], main_interaction, toDoListStartCount)
            //     break;
            // case 'options_back':
            //     //TODO
            //     break;

            case 'end_int':

        }
    })
}