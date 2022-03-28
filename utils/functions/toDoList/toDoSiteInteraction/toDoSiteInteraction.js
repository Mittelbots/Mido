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
                const buttons = await addButtons(options_interaction.guildId);

                todolist.edit({
                    components: [new MessageActionRow({
                        components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
                    })]
                }).catch(err => {})
                break;
            
            case 'options_next':
                const refresh = refreshProject_ToDo(main_interaction);
                const viewToDoList = await viewToDoList(refresh[0], refresh[1], main_interaction, )
                break;
            case 'options_back':
                //TODO
                break;

            case 'end_int':
                var comp = options_interaction.message.components[0].components
                for (let i in comp) {
                    comp[i].setDisabled(true)
                }
                todolist.edit({
                    components: [options_interaction.message.components[0]]
                });
                toDoCountInteraction = 0;
                break;
        }
    })
}