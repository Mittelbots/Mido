const {
    MessageActionRow
} = require("discord.js");
const database = require("../../../../bot/db/db");
const {
    toDoState_Active, increase_toDoAddCount, decrease_toDoAddCount, decrease_toDoInteractionCount, increase_toDoInteractionCount, getCurrentProjectId, changeCurrentProjectId
} = require("../../../variables/variables");
const {
    delay
} = require("../../delay/delay");
const {
    refreshProject_ToDo
} = require("../../getData/refreshProject_ToDo");
const {
    removeMention
} = require("../../removeCharacters/removeCharacters");
const {
    newToDoEmbed
} = require("../toDoListOverview");
const {
    viewToDoList
} = require('../viewToDoList');
const config = require('../../../assets/json/_config/config.json');
const { errorhandler } = require("../../errorhandler/errorhandler");
const { newToDoButtons } = require("../addButtonsToList");
const { getLang } = require("../../getData/getLang");


module.exports = async (main_interaction) => {

    if (increase_toDoInteractionCount() > 1) {
        return;
    }

    if(!getCurrentProjectId()) changeCurrentProjectId(main_interaction.customId.split('_')[1])

    const lang = require(`../../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)
    
    const buttons = newToDoButtons(false, lang)
    const task = await main_interaction.channel.send({
        embeds: [newToDoEmbed()],
        components: [new MessageActionRow({
            components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
        })]
    });

    var newToDocollector = await task.createMessageComponentCollector({
        filter: ((user) => user.user.id === main_interaction.user.id),
    });

    var title = '';
    var text = '';
    var deadline = '';
    var dateFormatDC = '';
    var user = '';
    var reminder = '';
    var reminderFormatDC = '';

    await newToDocollector.on('collect', async todo_interaction => {
        var todo_interaction_reply;

        if (increase_toDoAddCount() > 1) {
            interactionCount = 1;
            return;
        }

        switch (todo_interaction.customId) {
            case 'add_title':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_title
                });
                break;

            case 'add_text':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_text
                });
                break;

            case 'add_deadline':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_deadline
                });
                break;

            case 'add_other':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_other
                });
                break;

            case 'save':
                var canPass = true;

                if (title == '') {
                    canPass = false;
                    todo_interaction.channel.send({
                        content: lang.todo.newtodo.errors.title_missing
                    }).then(async msg => {
                        await delay(3000);
                        msg.delete();
                    });
                    decrease_toDoAddCount();
                }

                if (canPass) {
                    await database.query(`INSERT INTO ${config.tables.mido_todo} (user_id, title, text, deadline, other_user, cat_id, guild_id, state, reminder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [main_interaction.user.id, title, text, deadline, user, getCurrentProjectId(), main_interaction.member.guild.id, toDoState_Active, reminder])
                        .then(async () => {
                            await todo_interaction.channel.send({
                                content: lang.todo.newtodo.success.saved
                            }).then(async msg => {
                                await delay(3000);
                                msg.delete();
                                task.delete();
                                decrease_toDoInteractionCount();
                                decrease_toDoAddCount()

                                const refresh = await refreshProject_ToDo(main_interaction);
                                const categories = refresh[0];
                                const todo = refresh[1];
                                const newToDoList = await viewToDoList(categories, todo, main_interaction);
                                await main_interaction.message.edit({
                                    embeds: [newToDoList]
                                });
                            });
                        })
                        .catch(async err => {
                            errorhandler(err, null, null);
                            await todo_interaction.channel.send({
                                content: lang.todo.newtodo.errors.save_error
                            }).then(async msg => {
                                await delay(3000);
                                msg.delete();
                            });
                            decrease_toDoAddCount();
                        });
                }
                break;

            case 'next':
                await todo_interaction.message.edit({
                    components: [new MessageActionRow({
                        components: [newToDoButtons(true, lang)[0], newToDoButtons(true, lang)[1], newToDoButtons(true, lang)[2]]
                    })]
                });
                decrease_toDoAddCount();
                break;

            case 'cancel':
                decrease_toDoInteractionCount();
                decrease_toDoAddCount();
                await todo_interaction.message.delete();
                newToDocollector = null;
                todo_interaction = null;
                break;

            case 'back':
                await todo_interaction.message.edit({
                    components: [new MessageActionRow({
                        components: [newToDoButtons(false, lang)[0], newToDoButtons(false, lang)[1], newToDoButtons(false, lang)[2], newToDoButtons(false, lang)[3], newToDoButtons(false, lang)[4]]
                    })]
                });
                decrease_toDoAddCount();
                break;
        }

        var messageCollector = await main_interaction.message.channel.createMessageCollector({
            filter: ((user) => user.author.id === main_interaction.user.id),
            max: 1
        });

        messageCollector.on('collect', async reply => {
            switch (todo_interaction.customId) {
                case 'add_title':
                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        decrease_toDoAddCount();
                        reply.delete();
                        todo_interaction_reply.delete();
                        return;
                    }

                    title = reply.content;
                    try {
                        await task.edit({
                            embeds: [newToDoEmbed(title, text, deadline, user)]
                        });
                        decrease_toDoAddCount();
                    } catch (err) {
                        if (err.code == '50035') { //String too long
                            reply.reply({
                                content: lang.todo.newtodo.errors.title_tolong
                            }).then(async msg => {
                                await delay(4000);
                                msg.delete();
                            })
                        }
                    }
                    reply.delete();
                    todo_interaction_reply.delete();
                    decrease_toDoAddCount();
                    break;

                case 'add_text':
                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        decrease_toDoAddCount();
                        reply.delete();
                        todo_interaction_reply.delete();
                        return;
                    }

                    text = reply.content;
                    try {
                        task.edit({
                            embeds: [newToDoEmbed(title, text, deadline, user)]
                        });
                    } catch (err) {
                        if (err.code == '50035') { //String too long
                            reply.reply({
                                content: lang.todo.newtodo.errors.text_tolong
                            }).then(async msg => {
                                await delay(4000);
                                msg.delete();
                                reply.delete();
                                todo_interaction_reply.delete();
                                decrease_toDoAddCount();
                            })
                        }
                    }
                    reply.delete();
                    todo_interaction_reply.delete();
                    decrease_toDoAddCount();
                    break;

                case 'add_deadline':

                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        decrease_toDoAddCount();
                        reply.delete();
                        todo_interaction_reply.delete();
                        return;
                    }

                    deadline = reply.content;
                    deadline = deadline.split('.');

                    let day = deadline[0]
                    let month = deadline[1]
                    let year = (deadline[2] === ' ' || deadline[2] === undefined || deadline[2] === '') ? new Date().getFullYear().toString() : deadline[2];

                    let date = new Date(JSON.stringify(`${year}-${month}-${day}`));

                    await delay(1000);

                    if (JSON.stringify(date) != 'null') {

                        deadline = `${day}.${month}.${year}`;
                        dateFormatDC = ` <t:${Math.floor(date/1000)}:R>`

                        reply.delete();
                        todo_interaction_reply.delete();

                        const reminderMessage = await reply.channel.send(lang.todo.newtodo.interaction.add_reminder)
                        const collector = main_interaction.message.channel.createMessageCollector({
                            max: 1,
                            time: 30000
                        });

                        await collector.on('collect', async reply => {

                            reminder = reply.content;

                            if (reminder.toLowerCase() === 'none') {
                                decrease_toDoAddCount()
                                reply.delete();
                                return reminderMessage.delete();
                            }
                            try {
                                reminder = reminder.split(' ');
                            } catch (err) {
                                return reply.reply(lang.todo.newtodo.errors.no_space_in_reminder).then(async msg => {
                                    await delay(3000);
                                    reply.delete();
                                    msg.delete();
                                    reminderMessage.delete();
                                    decrease_toDoAddCount();
                                })
                            }

                            try {
                                var date = reminder[0].split('.');
                                var time = reminder[1].split(':');
                            } catch (err) {
                                return reply.reply(lang.todo.newtodo.errors.no_point_comma_in_reminder).then(async msg => {
                                    await delay(3000);
                                    reply.delete();
                                    msg.delete();
                                    reminderMessage.delete();
                                    decrease_toDoAddCount();
                                })
                            }

                            if (!date[2]) date[2] = new Date().getFullYear().toString();
                            let checkDate = new Date(date[2], date[1], date[0], time[0], time[1]);

                            await delay(1000);
                            if (JSON.stringify(checkDate) != 'null') {
                                reminder = `${date[2]}.${date[1]}.${date[0]} ${time[0]}:${time[1]}`;
                                reminderFormatDC = ` <t:${Math.floor(checkDate/1000)}:R>`
                            } else {
                                return reply.reply(lang.todo.newtodo.errors.reminder_wrong_date_format).then(async msg => {
                                    await delay(3000);
                                    decrease_toDoAddCount();
                                    reply.delete();
                                    reminderMessage.delete();
                                    msg.delete();
                                })
                            }

                            task.edit({
                                embeds: [newToDoEmbed(title, text, deadline + dateFormatDC + `\n🕐 **${lang.todo.reminder}:** ${reminder} ${reminderFormatDC}`, user)]
                            });

                        });

                        task.edit({
                            embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                        });
                    } else {
                        reply.channel.send({
                            content: lang.todo.newtodo.errors.reminder_wrong_date_format
                        }).then(async msg => {
                            await delay(3000);
                            msg.delete();
                            reply.delete();
                            todo_interaction_reply.delete();
                            decrease_toDoAddCount();
                        })
                    }

                    break;

                case 'add_other':
                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        decrease_toDoAddCount()
                        reply.delete();
                        todo_interaction_reply.delete();
                        return;
                    }

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
                                decrease_toDoAddCount();
                            })
                            i = other_user.length;
                            continue;
                        }

                        user += `${other_user[i]} `;
                    }
                    task.edit({
                        embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                    }).then(() => {
                        reply.delete();
                        todo_interaction_reply.delete();
                        decrease_toDoAddCount();
                    })
                    break;

                default:
                    break;
            }
        });
    });

    // const shortHandMessageCollector = main_interaction.message.channel.createMessageCollector({
    //     filter: ((user) => user.author.id === main_interaction.user.id),
    //     max: 1
    // });

    // shortHandMessageCollector.on('collect', async reply => {

    //     interactionCount++;
    //     if (interactionCount > 1) {
    //         return;
    //     }

    //     if (reply.content.toLowerCase() === 'cancel') {
    //         await reply.reply({
    //             content: lang.errors.canceled
    //         }).then(async msg => {
    //             await delay(3000);
    //             msg.delete();
    //         });
    //         decrease_toDoAddCount()
    //         reply.delete();
    //         return;
    //     }

    //     try {
    //         var content = reply.content.split(',');
    //     } catch (err) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.no_comma_in_shorthand
    //         }).then(async msg => {
    //             await delay(3000);
    //             msg.delete();
    //         });
    //         reply.delete();
    //         decrease_toDoAddCount()
    //         return;
    //     }

    //     title = content[0]; //!required
    //     text = content[1]; //!required
    //     deadline = content[2]; //!optional
    //     reminder = content[3]; //!optional
    //     other_user = content[4]; //!optional

    //     if (!title) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.title_missing
    //         }).then(async msg => {
    //             await delay(2000);
    //             msg.delete();
    //         });
    //         decrease_toDoAddCount()
    //         return;
    //     }
    //     if (!text) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.text_missing
    //         }).then(async msg => {
    //             await delay(2000);
    //             msg.delete();
    //         });
    //         decrease_toDoAddCount()
    //         return;
    //     }

    //     task.edit({
    //         embeds: [newToDoEmbed(title, text, deadline + dateFormatDC + `\n**${lang.todo.reminder}:** ${reminder} ${reminderFormatDC}`, user)]
    //     });

    // });
}