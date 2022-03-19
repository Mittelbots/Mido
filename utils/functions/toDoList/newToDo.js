const { MessageActionRow } = require("discord.js");
const { MessageButton } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { getLang } = require("../getData/getLang");
const { removeMention } = require("../removeCharacters/removeCharacters");
const { addSelectMenu } = require("./addSelecMenu");

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

    if(secondPage) {
        return [back_button, save_button, delete_button]
    }else {
        return [title_button, text_button, deadline_button, other_button, next_button]
    }
}

module.exports.newToDoInteraction = async (todo_item_interaction, main_interaction, count, currentCatId, categories, todolist, guild_id) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    var title = '';
    var text = '';
    var deadline = '';
    var dateFormatDC = '';
    var user = '';
    var reminder = '';
    var reminderFormatDC = '';

    switch (todo_item_interaction.customId) {
        case 'add_toDo':
            count++;
            if (count > 1) {
                return;
            }

            const task = await todo_item_interaction.channel.send({
                embeds: [this.newToDoEmbed()],
                components: [new MessageActionRow({
                    components: [this.newToDoButtons(false, lang)[0], this.newToDoButtons(false, lang)[1], this.newToDoButtons(false, lang)[2], this.newToDoButtons(false, lang)[3], this.newToDoButtons(false, lang)[4]]
                })]
            });

            const newToDocollector = await task.createMessageComponentCollector({
                filter: ((user) => user.user.id === main_interaction.user.id),
                time: 120000
            });

            var interactionCount = 0;
            await newToDocollector.on('collect', async todo_interaction => {
                var todo_interaction_reply;

                interactionCount++;
                if (interactionCount > 1) {
                    return;
                }
                switch (todo_interaction.customId) {
                    case 'add_title':
                        todo_interaction_reply = await todo_interaction.message.reply({
                            content: lang.todo.newtodo.interaction.add_title,
                            ephemeral: true
                        });
                        break;

                    case 'add_text':
                        todo_interaction_reply = await todo_interaction.message.reply({
                            content: lang.todo.newtodo.interaction.add_text,
                            ephemeral: true
                        });
                        break;

                    case 'add_deadline':
                        todo_interaction_reply = await todo_interaction.message.reply({
                            content: lang.todo.newtodo.interaction.add_deadline,
                            ephemeral: true
                        });
                        break;

                    case 'add_other':
                        todo_interaction_reply = await todo_interaction.message.reply({
                            content: lang.todo.newtodo.interaction.add_other,
                            ephemeral: true
                        });
                        break;

                    case 'save':
                        var canPass = true;

                        if (title == '') {
                            canPass = false;
                            todo_interaction.channel.send({
                                content: 'Der Titel fehlt!'
                            }).then(async msg => {
                                await delay(3000);
                                msg.delete();
                            })
                        }

                        if (text == '' && canPass) {
                            canPass = false;
                            todo_interaction.channel.send({
                                content: 'Der Text fehlt!'
                            }).then(async msg => {
                                await delay(3000);
                                msg.delete();
                            })
                        }

                        if (canPass) {
                            await database.query('INSERT INTO hn_todo (user_id, title, text, deadline, other_user, cat_id, guild_id, state, reminder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [main_interaction.user.id, title, text, deadline, user, currentCatId, main_interaction.member.guild.id, toDoState_Active, reminder])
                                .then(() => {
                                    todo_interaction.channel.send({
                                        content: lang.todo.newtodo.success.saved
                                    }).then(async msg => {
                                        await delay(3000);
                                        msg.delete();
                                    })
                                })
                                .catch(err => {
                                    console.log(err);
                                    todo_interaction.channel.send({
                                        content: lang.todo.newtodo.errors.save_error
                                    }).then(async msg => {
                                        await delay(3000);
                                        msg.delete();
                                    })
                                })

                            await delay(5000);
                            task.delete();
                            count = count - 1;
                        }
                        break;

                    case 'next':
                        await todo_interaction.message.edit({
                            components: [new MessageActionRow({
                                components: [this.newToDoButtons(true, lang)[0], this.newToDoButtons(true, lang)[1], this.newToDoButtons(true, lang)[2]]
                            })]
                        });
                        interactionCount--;
                        break;

                    case 'cancel':
                        count = count - 1;
                        await todo_interaction.message.delete();
                        interactionCount--;
                        newToDocollector = null;
                        todo_interaction = null;
                        break;

                    case 'back':
                        await todo_interaction.message.edit({
                            components: [new MessageActionRow({
                                components: [this.newToDoButtons(false, lang)[0], this.newToDoButtons(false, lang)[1], this.newToDoButtons(false, lang)[2], this.newToDoButtons(false, lang)[3], this.newToDoButtons(false, lang)[4]]
                            })]
                        });
                        interactionCount--;
                        break;
                }

                var messageCollector = await main_interaction.message.channel.createMessageCollector({
                    filter: ((user) => user.author.id === main_interaction.user.id),
                    max: 1
                });

                messageCollector.on('collect', async reply => {
                    switch (todo_interaction.customId) {
                        case 'add_title':
                            title = reply.content;
                            try {
                                await task.edit({
                                    embeds: [this.newToDoEmbed(title, text, deadline, user)]
                                });
                            } catch (err) {
                                if (err.code == '50035') { //String too long
                                    reply.reply({
                                        content: lang.todo.newtodo.errors.title_tolong
                                    }).then(async msg => {
                                        await delay(4000);
                                        msg.delete();
                                    })
                                    await delay(4000);
                                }
                            }
                            reply.delete();
                            todo_interaction_reply.delete();
                            interactionCount--;
                            break;

                        case 'add_text':
                            text = reply.content;
                            try {
                                task.edit({
                                    embeds: [this.newToDoEmbed(title, text, deadline, user)]
                                });
                            } catch (err) {
                                if (err.code == '50035') { //String too long
                                    reply.reply({
                                        content: lang.todo.newtodo.errors.text_tolong
                                    }).then(async msg => {
                                        await delay(4000);
                                        msg.delete();
                                    })
                                    await delay(4000);
                                }
                            }
                            reply.delete();
                            todo_interaction_reply.delete();
                            interactionCount--;
                            break;

                        case 'add_deadline':
                            deadline = reply.content;
                            deadline = deadline.split('.');

                            let day = deadline[0]
                            let month = deadline[1]
                            let year = deadline[2];

                            if (year === undefined) {
                                year = new Date().getFullYear().toString();
                            }
                            let date = new Date(JSON.stringify(`${year}-${month}-${day}`));

                            await delay(1000);

                            if (JSON.stringify(date) != 'null') {

                                deadline = `${day}.${month}.${year}`;
                                dateFormatDC = ` <t:${Math.floor(date/1000)}:R>`

                                const reminderMessage = await reply.channel.send(lang.todo.newtodo.interaction.add_reminder)
                                const collector = main_interaction.message.channel.createMessageCollector({
                                    max: 1,
                                    time: 30000
                                });

                                await collector.on('collect', async reply => {

                                    reminder = reply.content;

                                    if (reminder.toLowerCase() === 'none') {
                                        interactionCount--;
                                        reply.delete();
                                        return reminderMessage.delete();
                                    }
                                    try {
                                        reminder = reminder.split(' ');
                                    } catch (err) {
                                        return reply.reply(lang.todo.newtodo.errors.no_space_in_reminder)
                                    }

                                    try {
                                        var date = reminder[0].split('.');
                                        var time = reminder[1].split(':');
                                    } catch (err) {
                                        return reply.reply(lang.todo.newtodo.errors.no_point_comma_in_reminder);
                                    }

                                    if (!date[2]) date[2] = new Date().getFullYear().toString();
                                    let checkDate = new Date(date[2], date[1], date[0], time[0], time[1]);

                                    await delay(1000);
                                    if (JSON.stringify(checkDate) != 'null') {
                                        reminder = `${date[2]}-${date[1]}-${date[0]} ${time[0]}:${time[1]}`;
                                        reminderFormatDC = ` <t:${Math.floor(checkDate/1000)}:R>`
                                    } else {
                                        return reply.reply(lang.todo.newtodo.errors.reminder_wrong_date_format)
                                    }
                                    interactionCount--;
                                    reply.delete();
                                    reminderMessage.delete();
                                    task.edit({
                                        embeds: [this.newToDoEmbed(title, text, deadline + dateFormatDC + `\n**${lang.todo.reminder}:** ${date[0]}.${date[1]}.${date[2]} ${time[0]}:${time[1]} ${reminderFormatDC}`, user)]
                                    });

                                });

                                task.edit({
                                    embeds: [this.newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                                });
                            } else {
                                reply.channel.send({
                                    content: lang.todo.newtodo.errors.reminder_wrong_date_format
                                }).then(async msg => {
                                    await delay(3000);
                                    msg.delete();
                                })
                            }
                            reply.delete();
                            todo_interaction_reply.delete();
                            break;

                        case 'add_other':
                            let other_user = reply.content.split(' ');

                            for (let i in other_user) {
                                other_user[i] = removeMention(other_user[i]);

                                try {
                                    other_user[i] = main_interaction.message.guild.members.cache.find(member => member.id.includes(other_user[i])).user

                                } catch (err) {
                                    reply.channel.send({
                                        content: lang.errors.user_notfound
                                    }).then(async msg => {
                                        await delay(3000);
                                        msg.delete();
                                    })
                                    i = other_user.length;
                                    continue;
                                }

                                user += `${other_user[i]} `;
                            }
                            task.edit({
                                embeds: [this.newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                            });
                            reply.delete();
                            todo_interaction_reply.delete();
                            interactionCount--;
                            break;

                        default:
                            break;
                    }
                });
            });
        case 'change_cat':
            var old_int = todo_item_interaction;
            todo_item_interaction = null;
            var newSelectMenu = await addSelectMenu(categories, false, main_interaction.message.guild.id)
            old_int.message.edit({
                components: [new MessageActionRow({
                    components: [newSelectMenu]
                })]
            });
            if (count > 0) --count;
            break;

        case 'delete_toDo':
            if (count < 0) count = 0;

            count++;

            if (count > 1) {
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
                    --count;
                    reply.delete();
                    del_todoMessage.delete();
                    return;
                }
                if (isNaN(reply.content)) {
                    --count
                    return reply.reply({
                        content: lang.errors.only_numbers
                    }).then(async msg => {
                        await delay(50000);
                        reply.delete();
                        msg.delete();
                    })
                } else {
                    const task = await database.query('SELECT id FROM hn_todo WHERE id = ?', [reply.content])
                        .then(res => {
                            return res[0]
                        })
                        .catch(err => console.log(err));

                    if (task) {
                        return await database.query('DELETE FROM hn_todo WHERE id = ?', [reply.content])
                            .then(async () => {
                                --count
                                return reply.reply({
                                    content: lang.success.deleted
                                }).then(async msg => {
                                    await delay(50000);
                                    reply.delete();
                                    msg.delete();
                                })
                            })
                            .catch(err => {
                                --count
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
                        --count;
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
        case 'end_int':
            var comp = todo_item_interaction.message.components[0].components
            for (let i in comp) {
                comp[i].setDisabled(true)
            }
            todolist.edit({
                components: [todo_item_interaction.message.components[0]]
            });
            count = 0;
            interactionCount = 0;
            break;
    }
}