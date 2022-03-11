const { MessageButton } = require('discord.js');

const addButtons = () => {
    const add_toDo = new MessageButton({
        style: 'SUCCESS',
        label: `ADD ToDo`,
        customId: 'add_toDo'
    });

    const change_cat = new MessageButton({
        style: 'SECONDARY',
        label: `Andere Kategorie`,
        customId: 'change_cat'
    });

    const delete_toDo = new MessageButton({
        style: 'DANGER',
        label: `ToDo Item löschen`,
        customId: 'delete_toDo'
    });
    
    const end_interaction = new MessageButton({
        style: 'SECONDARY',
        label: `Interaktion beenden`,
        customId: 'end_int'
    });

    return [add_toDo, change_cat, delete_toDo, end_interaction]
}

module.exports = {addButtons}