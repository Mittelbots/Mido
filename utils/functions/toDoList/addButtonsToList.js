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

    return [add_toDo, change_cat, delete_toDo]
}

module.exports = {addButtons}