const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require("discord.js");
const database = require("../../../bot/db/db");
const { toDoState_Ready, toDoState_Deleted, increase_toDoInteractionCount, decrease_toDoInteractionCount } = require("../../variables/variables");
const {
    delay
} = require("../delay/delay");
const {
    getLang
} = require("../getData/getLang");
const { addOptionButtons } = require("./addButtonsToList");
const {
    addSelectMenu
} = require("./addSelectMenu");
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require("../errorhandler/errorhandler");
const { editToDoList } = require("./editToDoList/editToDoList");
const { refreshProject_ToDo } = require("../getData/refreshProject_ToDo");

module.exports.newToDoEmbed = (title, text, deadline, other_user) => {
    const messageEmbed = new MessageEmbed()
        .setTitle('Dein neuer Task im Überblick.')
        .addField('Titel:', (title) ? title : 'Noch nicht gesetzt. (required)')
        .addField('Text:', (text) ? text : 'Noch nicht gesetzt. (required)')
        .addField('Deadline:', (deadline) ? deadline : 'Noch nicht gesetzt. (optional)')
        .addField('Andere Nutzer:', (other_user) ? other_user : 'Noch nicht gesetzt. (optional)')
        .setTimestamp()


    return messageEmbed;
}


module.exports.newToDoButtons = (secondPage, lang) => {
    const title_button = new MessageButton({
        style: 'SUCCESS',
        label: lang.todo.newtodo.buttons.add_title,
        customId: 'add_title'
    });

    const text_button = new MessageButton({
        style: 'SUCCESS',
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

module.exports.toDoListOverview = async (todo_item_interaction, main_interaction, currentCatId, categories, todolist, guild_id) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    switch (todo_item_interaction.customId) {
        case 'add_toDo':
            if (increase_toDoInteractionCount() > 1) {
                return;
            }
            await require('./newToDo/addNewToDo')(todo_item_interaction, main_interaction, lang, currentCatId)
            break;
        case 'change_prod':
            if (increase_toDoInteractionCount() > 1) {
                return;
            }
            var newSelectMenu = await addSelectMenu(categories, false, main_interaction.message.guild.id)
            await todo_item_interaction.message.edit({
                components: [new MessageActionRow({
                    components: [newSelectMenu]
                })]
            });
            return newSelectMenu = null;

        case 'delete_toDo':
            if (increase_toDoInteractionCount() > 1) {
                return;
            }
            var del_todoMessage = await todo_item_interaction.channel.send({
                content: `${lang.todo.delete_todo.interaction.insert_id} ${lang.tips.cancel}`,
                ephemeral: true
            });

            var messageCollectorDeleteToDo = await main_interaction.message.channel.createMessageCollector({
                filter: ((user) => user.author.id === main_interaction.user.id),
                time: 15000,
                max: 1
            });

            messageCollectorDeleteToDo.on('collect', async reply => {
                if (reply.content.toLowerCase() === 'cancel') {
                    await reply.reply({
                        content: lang.errors.canceled
                    }).then(async msg => {
                        await delay(3000);
                        decrease_toDoInteractionCount();
                        reply.delete();
                        del_todoMessage.delete();
                        msg.delete();
                    });

                    return;
                }
                if (isNaN(reply.content)) {
                    return reply.reply({
                        content: lang.errors.only_numbers
                    }).then(async msg => {
                        await delay(3000);
                        decrease_toDoInteractionCount();
                        reply.delete();
                        msg.delete();
                        del_todoMessage.delete();
                    })
                } else {
                    const task = await database.query(`SELECT id FROM ${config.tables.mido_todo} WHERE id = ?`, [reply.content])
                        .then(res => {
                            return res[0]
                        })
                        .catch(err => console.log(err));

                    if (task) {
                        return await database.query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [toDoState_Deleted , reply.content])
                            .then(async () => {
                                return reply.reply({
                                    content: lang.success.deleted
                                }).then(async msg => {
                                    await delay(3000);

                                    const refresh = await refreshProject_ToDo(main_interaction);
                                    let projects = refresh[0];
                                    let todo = refresh[1];
                                    await editToDoList(projects, todo, main_interaction, true);

                                    decrease_toDoInteractionCount();
                                    reply.delete();
                                    msg.delete();
                                    del_todoMessage.delete();
                                })
                            })
                            .catch(err => {
                                errorhandler(err);
                                return reply.reply({
                                    content: lang.todo.delete_todo.errors.delete_todo_error
                                }).then(async msg => {
                                    await delay(3000);
                                    decrease_toDoInteractionCount();
                                    reply.delete();
                                    msg.delete();
                                    del_todoMessage.delete();
                                })
                            })
                    } else {
                        return reply.reply({
                            content: lang.todo.delete_todo.errors.item_notfound_withId
                        }).then(async msg => {
                            await delay(3000);
                            decrease_toDoInteractionCount();
                            reply.delete();
                            msg.delete();
                            del_todoMessage.delete();
                        })
                    }
                }
            });
            break;
        case 'set_todo_ready':
            if (increase_toDoInteractionCount() > 1) {
                return;
            }
            var set_todo_ready_Message = await todo_item_interaction.channel.send({
                content: `${lang.todo.set_todo_ready.interaction.insert_id} ${lang.tips.cancel}`,
                ephemeral: true
            });

            var messageCollectorDeleteToDo = await main_interaction.message.channel.createMessageCollector({
                filter: ((user) => user.author.id === main_interaction.user.id),
                time: 15000,
                max: 1
            });

            messageCollectorDeleteToDo.on('collect', async reply => {
                if (reply.content.toLowerCase() === 'cancel') {
                    await reply.reply({
                        content: lang.errors.canceled
                    }).then(async msg => {
                        await delay(3000);
                        msg.delete();
                        decrease_toDoInteractionCount();
                        reply.delete();
                        set_todo_ready_Message.delete();
                    });

                    return;
                }
                if (isNaN(reply.content)) {
                    return reply.reply({
                        content: lang.errors.only_numbers
                    }).then(async msg => {
                        await delay(3000);
                        msg.delete();
                        decrease_toDoInteractionCount();
                        reply.delete();
                        set_todo_ready_Message.delete();
                    })
                } else {
                    const task = await database.query(`SELECT id, state FROM ${config.tables.mido_todo} WHERE id = ?`, [reply.content])
                        .then(res => {
                            return res[0]
                        })
                        .catch(err => console.log(err));

                    if (task) {
                        if(task.id === reply.content) {
                            decrease_toDoInteractionCount();
                            return reply.reply(lang.errors.task_already_ready).then(async msg => {
                                await delay(2000);
                                decrease_toDoInteractionCount();
                                reply.delete();
                                set_todo_ready_Message.delete();
                            })
                        }
                        return await database.query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [toDoState_Ready, reply.content])
                            .then(async () => {
                                return reply.reply({
                                    content: lang.success.set_to_read
                                }).then(async msg => {
                                    await delay(3000);
                                    const refresh = await refreshProject_ToDo(main_interaction);
                                    let projects = refresh[0];
                                    let todo = refresh[1];
                                    await editToDoList(projects, todo, main_interaction, true);

                                    msg.delete();
                                    decrease_toDoInteractionCount();
                                    reply.delete();
                                    set_todo_ready_Message.delete();
                                })
                            })
                            .catch(err => {
                                errorhandler(err)
                                return reply.reply({
                                    content: lang.todo.set_todo_ready.errors.set_todo_ready_error
                                }).then(async msg => {
                                    await delay(3000);
                                    msg.delete();
                                    decrease_toDoInteractionCount();
                                    reply.delete();
                                    set_todo_ready_Message.delete();
                                })
                            })
                    } else {
                        return reply.reply({
                            content: lang.todo.set_todo_ready.errors.item_notfound_withId
                        }).then(async msg => {
                            await delay(50000);
                            msg.delete();
                            decrease_toDoInteractionCount();
                            reply.delete();
                            set_todo_ready_Message.delete();
                        })
                    }
                }

            });
            break;

        case 'options': 
            const optionsButtons = await addOptionButtons(guild_id, currentCatId);
            todolist.edit({
                components: [new MessageActionRow({
                    components: [optionsButtons[0], optionsButtons[1], optionsButtons[2], optionsButtons[3]]
                })]
            });
    }
}