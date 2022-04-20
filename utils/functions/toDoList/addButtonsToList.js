const { MessageButton } = require('discord.js');
const { getLang } = require('../getData/getLang');
const config = require('../../assets/json/_config/config.json');
const { getCurrentProjectId } = require('../../variables/variables');

module.exports.addButtons = async ({main_interaction}) => {

    const lang = require(`../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`)

    const add_toDo = new MessageButton({
        style: config.buttons.add_toDo.style,
        label: lang.todo.buttons.add,
        customId: config.buttons.add_toDo.customId + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.add_toDo.emoji
    });

    const change_prod = new MessageButton({
        style: config.buttons.change_prod.style, 
        label: lang.todo.buttons.change_project,
        customId: config.buttons.change_prod.customId,
        emoji: config.buttons.change_prod.emoji
    });

    const edit_toDo = new MessageButton({
        style: config.buttons.edit_toDo.style, 
        label: lang.todo.buttons.edit,
        customId: config.buttons.edit_toDo.customId + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.edit_toDo.emoji
    });
    
    const set_todo_ready = new MessageButton({
        style: config.buttons.set_todo_ready.style,
        label: lang.todo.buttons.set_todo_ready,
        customId: config.buttons.set_todo_ready.customId + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.set_todo_ready.emoji
    });

    const options = new MessageButton({
        style: config.buttons.options.style,
        label: lang.todo.buttons.options,
        customId: config.buttons.options.customId + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.options.emoji
    });
    
    return [add_toDo, edit_toDo, change_prod, set_todo_ready, options]
}

module.exports.addOptionButtons = async ({main_interaction}) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`)
    const currentProjectId = getCurrentProjectId(main_interaction.user.id);

    const backToMain = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.buttons.options_backToMain,
        customId: 'optionsbackToMain_' + currentProjectId,
        emoji: '🏠'
    });

    const options_next = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options_next,
        customId: 'optionsnext_' + currentProjectId,
        emoji: '➡️'
    });

    const options_back = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.buttons.options_back,
        customId: 'optionsbackSite_' + currentProjectId,
        emoji: '⬅️'
    });

    const delete_toDo = new MessageButton({
        style: config.buttons.delete_toDo.style,
        label: lang.todo.buttons.delete,
        customId: config.buttons.delete_toDo.customId + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.delete_toDo.emoji
    });

    const end_interaction = new MessageButton({
        style: 'DANGER',
        label: lang.todo.buttons.end_int,
        customId: 'endint_' + currentProjectId,
        emoji: '❌'
    });


    return [backToMain, options_back, options_next, delete_toDo, end_interaction];
}

module.exports.newToDoButtons = (secondPage, lang) => {
    const title_button = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.newtodo.buttons.add_title,
        customId: 'add_title'
    });

    const text_button = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.newtodo.buttons.add_text,
        customId: 'add_text'
    });

    const deadline_button = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.newtodo.buttons.add_deadline,
        customId: 'add_deadline'
    });

    const other_button = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.newtodo.buttons.add_user,
        customId: 'add_other'
    });

    const next_button = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.newtodo.buttons.next,
        customId: 'next'
    });

    const save_button = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.newtodo.buttons.save,
        customId: 'save'
    });

    const delete_button = new MessageButton({
        style: 'DANGER',
        label: lang.todo.newtodo.buttons.cancel,
        customId: 'cancel'
    });

    const back_button = new MessageButton({
        style: 'SECONDARY',
        label: lang.todo.newtodo.buttons.back,
        customId: 'back'
    })

    if (secondPage) {
        return [back_button, save_button, delete_button]
    } else {
        return [title_button, text_button, deadline_button, other_button, next_button]
    }
}