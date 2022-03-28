const {
    MessageActionRow,
    MessageButton,
    MessageEmbed
} = require("discord.js");
const database = require("../../../bot/db/db");
const { toDoState_Ready, toDoState_Deleted } = require("../../variables/variables");
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

module.exports.toDoListOverview = async (todo_item_interaction, main_interaction, toDoCountInteraction, currentCatId, categories, todolist, guild_id) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    switch (todo_item_interaction.customId) {
        case 'add_toDo':
            if (toDoCountInteraction < 0) toDoCountInteraction = 0;
            toDoCountInteraction++;
            if (toDoCountInteraction > 1) {
                return;
            }
            await require('./newToDo/addNewToDo')(toDoCountInteraction, todo_item_interaction, main_interaction, lang, currentCatId)
            break;
        case 'change_cat':
            if (toDoCountInteraction < 0) toDoCountInteraction = 0;
            toDoCountInteraction++;
            if (toDoCountInteraction > 1) {
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
            if (toDoCountInteraction < 0) toDoCountInteraction = 0;
            toDoCountInteraction++;
            if (toDoCountInteraction > 1) {
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
                        msg.delete();
                    });
                    toDoCountInteraction = 0;
                    reply.delete();
                    del_todoMessage.delete();
                    return;
                }
                if (isNaN(reply.content)) {
                    toDoCountInteraction = 0;
                    return reply.reply({
                        content: lang.errors.only_numbers
                    }).then(async msg => {
                        await delay(50000);
                        reply.delete();
                        msg.delete();
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
                                toDoCountInteraction = 0;
                                return reply.reply({
                                    content: lang.success.deleted
                                }).then(async msg => {
                                    await delay(50000);
                                    reply.delete();
                                    msg.delete();
                                })
                            })
                            .catch(err => {
                                toDoCountInteraction = 0;
                                console.log(err);
                                return reply.reply({
                                    content: lang.todo.delete_todo.errors.delete_todo_error
                                }).then(async msg => {
                                    await delay(50000);
                                    reply.delete();
                                    msg.delete();
                                })
                            })
                    } else {
                        toDoCountInteraction = 0;
                        return reply.reply({
                            content: lang.todo.delete_todo.errors.item_notfound_withId
                        }).then(async msg => {
                            await delay(50000);
                            reply.delete();
                            msg.delete();
                        })
                    }
                }
            });
            break;
        case 'set_todo_ready':
            if (toDoCountInteraction < 0) toDoCountInteraction = 0;
            toDoCountInteraction++;
            if (toDoCountInteraction > 1) {
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
                    });
                    toDoCountInteraction = 0;
                    reply.delete();
                    set_todo_ready_Message.delete();
                    return;
                }
                if (isNaN(reply.content)) {
                    toDoCountInteraction = 0;
                    return reply.reply({
                        content: lang.errors.only_numbers
                    }).then(async msg => {
                        await delay(50000);
                        reply.delete();
                        msg.delete();
                    })
                } else {
                    const task = await database.query(`SELECT id, state FROM ${config.tables.mido_todo} WHERE id = ?`, [reply.content])
                        .then(res => {
                            return res[0]
                        })
                        .catch(err => console.log(err));

                    if (task) {
                        if(task.id === reply.content) {
                            toDoCountInteraction = 0;
                            return reply.reply(lang.errors.task_already_ready).then(async msg => {
                                await delay()
                            })
                        }
                        return await database.query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [toDoState_Ready, reply.content])
                            .then(async () => {
                                toDoCountInteraction = 0;
                                return reply.reply({
                                    content: lang.success.set_to_read
                                }).then(async msg => {
                                    await delay(3000);
                                    reply.delete();
                                    msg.delete();
                                })
                            })
                            .catch(err => {
                                toDoCountInteraction = 0;
                                console.log(err);
                                return reply.reply({
                                    content: lang.todo.set_todo_ready.errors.set_todo_ready_error
                                }).then(async msg => {
                                    await delay(50000);
                                    reply.delete();
                                    msg.delete();
                                })
                            })
                    } else {
                        toDoCountInteraction = 0;
                        return reply.reply({
                            content: lang.todo.set_todo_ready.errors.item_notfound_withId
                        }).then(async msg => {
                            await delay(50000);
                            reply.delete();
                            msg.delete();
                        })
                    }
                }

            });
            break;

        case 'options': 
            const optionsButtons = await addOptionButtons(guild_id);
            todolist.edit({
                components: [new MessageActionRow({
                    components: [optionsButtons[0], optionsButtons[1], optionsButtons[2], optionsButtons[3]]
                })]
            });

            require('./toDoSiteInteraction/toDoSiteInteraction')(todo_item_interaction, main_interaction, lang, todolist, toDoCountInteraction)
            break;
    }
}