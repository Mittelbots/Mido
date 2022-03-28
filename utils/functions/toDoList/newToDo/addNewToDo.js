const {
    MessageActionRow
} = require("discord.js");
const database = require("../../../../bot/db/db");
const {
    toDoState_Active
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
    newToDoEmbed,
    newToDoButtons
} = require("../toDoListOverview");
const {
    viewToDoList
} = require('../viewToDoList');

var interactionCount = 0;

module.exports = async (toDoCountInteraction, todo_item_interaction, main_interaction, lang, currentCatId) => {

    const buttons = newToDoButtons(false, lang)
    const task = await todo_item_interaction.channel.send({
        embeds: [newToDoEmbed()],
        components: [new MessageActionRow({
            components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
        })]
    });

    var newToDocollector = await task.createMessageComponentCollector({
        filter: ((user) => user.user.id === main_interaction.user.id),
        time: 120000
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

        interactionCount++;
        if (interactionCount > 1) {
            interactionCount = 1;
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
                        content: lang.todo.newtodo.errors.title_missing
                    }).then(async msg => {
                        await delay(3000);
                        msg.delete();
                    });
                    interactionCount = 0;
                }

                if (text == '' && canPass) {
                    canPass = false;
                    todo_interaction.channel.send({
                        content: lang.todo.newtodo.errors.text_missing
                    }).then(async msg => {
                        await delay(3000);
                        msg.delete();
                    });
                    interactionCount = 0;
                }

                if (canPass) {
                    await database.query('INSERT INTO mido_todo (user_id, title, text, deadline, other_user, cat_id, guild_id, state, reminder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [main_interaction.user.id, title, text, deadline, user, currentCatId, main_interaction.member.guild.id, toDoState_Active, reminder])
                        .then(async () => {
                            await todo_interaction.channel.send({
                                content: lang.todo.newtodo.success.saved
                            }).then(async msg => {
                                await delay(3000);
                                msg.delete();
                                task.delete();
                                toDoCountInteraction = 0;
                                interactionCount = 0;

                                const refresh = await refreshProject_ToDo(main_interaction);
                                const categories = refresh[0];
                                const todo = refresh[1];
                                const newToDoList = await viewToDoList(categories, todo, main_interaction, 0);

                                await main_interaction.message.edit({
                                    embeds: [newToDoList[1]]
                                });
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            todo_interaction.channel.send({
                                content: lang.todo.newtodo.errors.save_error
                            }).then(async msg => {
                                await delay(3000);
                                msg.delete();
                            });
                            interactionCount = 0;
                        });
                }
                break;

            case 'next':
                await todo_interaction.message.edit({
                    components: [new MessageActionRow({
                        components: [newToDoButtons(true, lang)[0], newToDoButtons(true, lang)[1], newToDoButtons(true, lang)[2]]
                    })]
                });
                interactionCount = 0;
                break;

            case 'cancel':
                toDoCountInteraction = 0;
                await todo_interaction.message.delete();
                interactionCount = 0;
                newToDocollector = null;
                todo_interaction = null;
                break;

            case 'back':
                await todo_interaction.message.edit({
                    components: [new MessageActionRow({
                        components: [newToDoButtons(false, lang)[0], newToDoButtons(false, lang)[1], newToDoButtons(false, lang)[2], newToDoButtons(false, lang)[3], newToDoButtons(false, lang)[4]]
                    })]
                });
                interactionCount = 0;
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
                        interactionCount = 0;
                        reply.delete();
                        todo_interaction_reply.delete();
                        return;
                    }

                    title = reply.content;
                    try {
                        await task.edit({
                            embeds: [newToDoEmbed(title, text, deadline, user)]
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
                    interactionCount = 0;
                    break;

                case 'add_text':
                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        interactionCount = 0;
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
                            })
                            await delay(4000);
                        }
                    }
                    reply.delete();
                    todo_interaction_reply.delete();
                    interactionCount = 0;
                    break;

                case 'add_deadline':

                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        interactionCount = 0;
                        reply.delete();
                        todo_interaction_reply.delete();
                        return;
                    }

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
                                interactionCount = 0;
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
                                reminder = `${date[2]}.${date[1]}.${date[0]} ${time[0]}:${time[1]}`;
                                reminderFormatDC = ` <t:${Math.floor(checkDate/1000)}:R>`
                            } else {
                                return reply.reply(lang.todo.newtodo.errors.reminder_wrong_date_format)
                            }
                            interactionCount = 0;
                            reply.delete();
                            reminderMessage.delete();
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
                        })
                    }
                    reply.delete();
                    todo_interaction_reply.delete();
                    break;

                case 'add_other':
                    if (reply.content.toLowerCase() === 'cancel' || reply.content.toLowerCase() === 'none') {
                        interactionCount = 0;
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
                            })
                            i = other_user.length;
                            continue;
                        }

                        user += `${other_user[i]} `;
                    }
                    task.edit({
                        embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                    });
                    reply.delete();
                    todo_interaction_reply.delete();
                    interactionCount = 0;
                    break;

                default:
                    break;
            }
        });
    });

    const shortHandMessageCollector = main_interaction.message.channel.createMessageCollector({
        filter: ((user) => user.author.id === main_interaction.user.id),
        max: 1
    });

    shortHandMessageCollector.on('collect', async reply => {

        interactionCount++;
        if (interactionCount > 1) {
            return;
        }

        if (reply.content.toLowerCase() === 'cancel') {
            await reply.reply({
                content: lang.errors.canceled
            }).then(async msg => {
                await delay(3000);
                msg.delete();
            });
            interactionCount = 0;
            reply.delete();
            return;
        }

        try {
            var content = reply.content.split(',');
        } catch (err) {
            await reply.reply({
                content: lang.todo.newtodo.errors.no_comma_in_shorthand
            }).then(async msg => {
                await delay(3000);
                msg.delete();
            });
            reply.delete();
            interactionCount = 0;
            return;
        }

        title = content[0]; //!required
        text = content[1]; //!required
        deadline = content[2]; //!optional
        reminder = content[3]; //!optional
        other_user = content[4]; //!optional

        if (!title) {
            await reply.reply({
                content: lang.todo.newtodo.errors.title_missing
            }).then(async msg => {
                await delay(2000);
                msg.delete();
            });
            interactionCount = 0;
            return;
        }
        if (!text) {
            await reply.reply({
                content: lang.todo.newtodo.errors.text_missing
            }).then(async msg => {
                await delay(2000);
                msg.delete();
            });
            interactionCount = 0;
            return;
        }

        task.edit({
            embeds: [newToDoEmbed(title, text, deadline + dateFormatDC + `\n**${lang.todo.reminder}:** ${reminder} ${reminderFormatDC}`, user)]
        });

    });
}