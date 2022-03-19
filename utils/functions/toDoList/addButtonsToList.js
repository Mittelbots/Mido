const { MessageButton } = require('discord.js');
const { getLang } = require('../getData/getLang');
const addButtons = async (guild_id) => {

    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    const add_toDo = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.buttons.add,
        customId: 'add_toDo'
    });

    const change_cat = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.change_project,
        customId: 'change_cat'
    });

    const delete_toDo = new MessageButton({
        style: 'DANGER',
        label: lang.todo.buttons.delete,
        customId: 'delete_toDo'
    });
    
    const end_interaction = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.end_int,
        customId: 'end_int'
    });
    
    return [add_toDo, change_cat, delete_toDo, end_interaction]
}

module.exports = {addButtons}