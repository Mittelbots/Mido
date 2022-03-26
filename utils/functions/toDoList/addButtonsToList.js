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
    
    const set_todo_ready = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.buttons.set_todo_ready,
        customId: 'set_todo_ready'
    });

    const options = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options,
        customId: 'options'
    });
    
    return [add_toDo, change_cat, delete_toDo, set_todo_ready, options]
}

const addOptionButtons = async (guild_id) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    const backToMain = new MessageButton({
        style: 'DANGER',
        label: lang.todo.buttons.options_backToMain,
        customId: 'options_backToMain'
    });

    const options_next = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options_next,
        customId: 'options_next'
    });

    const options_back = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options_back,
        customId: 'options_back'
    });

    const end_interaction = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.end_int,
        customId: 'end_int'
    });


    return [backToMain, options_next, options_back, end_interaction];
}

module.exports = {addButtons, addOptionButtons}