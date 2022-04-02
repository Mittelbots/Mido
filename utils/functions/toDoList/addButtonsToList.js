const { MessageButton } = require('discord.js');
const { getLang } = require('../getData/getLang');
const addButtons = async (guild_id) => {

    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    const add_toDo = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.buttons.add,
        customId: 'add_toDo',
        emoji: '📝'
    });

    const change_prod = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.change_project,
        customId: 'change_prod',
        emoji: '📋'
    });

    const delete_toDo = new MessageButton({
        style: 'DANGER',
        label: lang.todo.buttons.delete,
        customId: 'delete_toDo',
        emoji: '🗑️'
    });
    
    const set_todo_ready = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.buttons.set_todo_ready,
        customId: 'set_todo_ready',
        emoji: '✅'
    });

    const options = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options,
        customId: 'options',
        emoji: '⚙️'
    });
    
    return [add_toDo, change_prod, set_todo_ready, delete_toDo, options]
}

const addOptionButtons = async (guild_id, currentProjectId) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    const backToMain = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.buttons.options_backToMain,
        customId: 'options_backToMain_' + currentProjectId,
        emoji: '🏠'
    });

    const options_next = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options_next,
        customId: 'options_next_' + currentProjectId,
        emoji: '➡️'
    });

    const options_back = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options_back,
        customId: 'options_back_' + currentProjectId,
        emoji: '⬅️'
    });

    const end_interaction = new MessageButton({
        style: 'DANGER',
        label: lang.todo.buttons.end_int,
        customId: 'end_int_' + currentProjectId,
        emoji: '❌'
    });


    return [backToMain, options_back, options_next, end_interaction];
}

module.exports = {addButtons, addOptionButtons}