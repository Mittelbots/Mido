const { ButtonBuilder, ButtonStyle } = require('discord.js');
const { getLang } = require('../getData/getLang');
const config = require('../../assets/json/_config/config.json');
const { getCurrentProjectId } = require('../../variables/variables');

module.exports.addButtons = async ({main_interaction}) => {

    const lang = require(`../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`)

    const add_toDo = new ButtonBuilder({
        style: ButtonStyle.Success,
        label: lang.todo.buttons.add,
        customId: config.buttons.add_toDo.customId + ' $' + main_interaction.user.id + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.add_toDo.emoji
    });

    const change_prod = new ButtonBuilder({
        style: ButtonStyle.Secondary, 
        label: lang.todo.buttons.change_project,
        customId: config.buttons.change_prod.customId + ' $' + main_interaction.user.id,
        emoji: config.buttons.change_prod.emoji
    });

    const edit_toDo = new ButtonBuilder({
        style: ButtonStyle.Secondary, 
        label: lang.todo.buttons.edit,
        customId: config.buttons.edit_toDo.customId + ' $' + main_interaction.user.id + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.edit_toDo.emoji
    });
    
    const set_todo_ready = new ButtonBuilder({
        style: ButtonStyle.Success,
        label: lang.todo.buttons.set_todo_ready,
        customId: config.buttons.set_todo_ready.customId + ' $' + main_interaction.user.id + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.set_todo_ready.emoji
    });

    const options = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.buttons.options,
        customId: config.buttons.options.customId + ' $' + main_interaction.user.id + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.options.emoji
    });
    
    return [add_toDo, edit_toDo, change_prod, set_todo_ready, options]
}

module.exports.addOptionButtons = async ({main_interaction}) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`)
    const currentProjectId = getCurrentProjectId(main_interaction.user.id);

    const backToMain = new ButtonBuilder({
        style: ButtonStyle.Success,
        label: lang.todo.buttons.options_backToMain,
        customId: 'optionsbackToMain'+ ' $' + main_interaction.user.id +'_' + currentProjectId,
        emoji: '🏠'
    });

    const options_next = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.buttons.options_next,
        customId: 'optionsnext' + ' $' + main_interaction.user.id + '_' + currentProjectId,
        emoji: '➡️'
    });

    const options_back = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.buttons.options_back,
        customId: 'optionsbackSite' + ' $' + main_interaction.user.id + '_' + currentProjectId,
        emoji: '⬅️'
    });

    const delete_toDo = new ButtonBuilder({
        style: ButtonStyle.Danger,
        label: lang.todo.buttons.delete,
        customId: config.buttons.delete_toDo.customId + ' $' + main_interaction.user.id + '_' + getCurrentProjectId(main_interaction.user.id),
        emoji: config.buttons.delete_toDo.emoji
    });

    const end_interaction = new ButtonBuilder({
        style: ButtonStyle.Danger,
        label: lang.todo.buttons.end_int,
        customId: 'endint_' + currentProjectId,
        emoji: '❌'
    });


    return [backToMain, options_back, options_next, delete_toDo, end_interaction];
}

module.exports.newToDoButtons = (main_interaction, secondPage, lang) => {
    const title_button = new ButtonBuilder({
        style: ButtonStyle.Success,
        label: lang.todo.newtodo.buttons.add_title,
        customId: 'add_title' + ' $' + main_interaction.user.id
    });

    const text_button = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.newtodo.buttons.add_text,
        customId: 'add_text' + ' $' + main_interaction.user.id
    });

    const deadline_button = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.newtodo.buttons.add_deadline,
        customId: 'add_deadline' + ' $' + main_interaction.user.id
    });

    const other_button = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.newtodo.buttons.add_user,
        customId: 'add_other' + ' $' + main_interaction.user.id
    });

    const next_button = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.newtodo.buttons.next,
        customId: 'next' + ' $' + main_interaction.user.id
    });

    const save_button = new ButtonBuilder({
        style: ButtonStyle.Success,
        label: lang.todo.newtodo.buttons.save,
        customId: 'save' + ' $' + main_interaction.user.id
    });

    const delete_button = new ButtonBuilder({
        style: ButtonStyle.Danger,
        label: lang.todo.newtodo.buttons.cancel,
        customId: 'cancel' + ' $' + main_interaction.user.id
    });

    const back_button = new ButtonBuilder({
        style: ButtonStyle.Secondary,
        label: lang.todo.newtodo.buttons.back,
        customId: 'back' + '$' + main_interaction.user.id
    })

    if (secondPage) {
        return [back_button, save_button, delete_button]
    } else {
        return [title_button, text_button, deadline_button, other_button, next_button]
    }
}