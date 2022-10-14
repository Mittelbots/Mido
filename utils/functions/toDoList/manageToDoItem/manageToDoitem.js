const database = require('../../../../bot/db/db');
const { newToDoEmbed } = require('../newToDo/newToDoEmbed');
const { ActionRowBuilder } = require('discord.js');
const {
    toDoState_Active,
    increase_toDoAddCount,
    decrease_toDoAddCount,
    decrease_toDoInteractionCount,
    getCurrentProjectId,
} = require('../../../variables/variables');
const { delay } = require('../../delay/delay');
const { refreshProject_ToDo } = require('../../getData/refreshProject_ToDo');
const { removeMention } = require('../../removeCharacters/removeCharacters');
const { viewToDoList } = require('../viewToDoList');
const config = require('../../../assets/json/_config/config.json');
const { errorhandler } = require('../../errorhandler/errorhandler');
const { getLang } = require('../../getData/getLang');
const { newToDoButtons } = require('../addButtonsToList');
const { getToDo } = require('../../getData/getToDo');
const { editToItemEmbed } = require('../editToDoItem/editToDoItemEmbed');
const { createLog } = require('../../log/mido_log');

module.exports.manageToDoItem = async ({ main_interaction, toDoId, isNewTask }) => {
    const lang = require(`../../../assets/json/language/${await getLang(
        main_interaction.message.guild.id
    )}.json`);

    var title = '';
    var text = '';
    var deadline = '';
    var dateFormatDC = '';
    var user = '';
    var reminder = '';
    var reminderFormatDC = '';

    var manageTask;
    if (isNewTask) {
        const buttons = newToDoButtons(main_interaction, false, lang);
        manageTask = await main_interaction.channel.send({
            embeds: [newToDoEmbed()],
            components: [
                new ActionRowBuilder({
                    components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]],
                }),
            ],
        });
    } else {
        var toDoItem = await getToDo(main_interaction.message.channel, toDoId);
        toDoItem = toDoItem[0];

        title = toDoItem.title;
        text = toDoItem.text;
        deadline = toDoItem.deadline;
        reminder = toDoItem.reminder;
        user = toDoItem.other_user;

        var old_title = toDoItem.title;
        var old_text = toDoItem.text;
        var old_deadline = toDoItem.deadline;
        var old_reminder = toDoItem.reminder;
        var old_user = toDoItem.other_user;

        const buttons = newToDoButtons(main_interaction, false, lang);

        manageTask = await main_interaction.channel.send({
            embeds: [
                editToItemEmbed(
                    toDoItem.title,
                    toDoItem.text,
                    toDoItem.deadline,
                    toDoItem.other_user,
                    toDoId
                ),
            ],
            components: [
                new ActionRowBuilder({
                    components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]],
                }),
            ],
        });
    }

    var newToDocollector = await manageTask.createMessageComponentCollector({
        filter: (user) => user.user.id === main_interaction.user.id,
    });

    await newToDocollector.on('collect', async (todo_interaction) => {
        var todo_interaction_reply;

        if (increase_toDoAddCount(main_interaction.user.id) > 1) {
            return;
        }

        switch (todo_interaction.customId.split(' ')[0]) {
            case 'add_title':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_title,
                });
                break;

            case 'add_text':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_text,
                });
                break;

            case 'add_deadline':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_deadline,
                });
                break;

            case 'add_other':
                todo_interaction_reply = await todo_interaction.message.reply({
                    content: lang.todo.newtodo.interaction.add_other,
                });
                break;

            case 'save':
                var canPass = true;

                if (title == '') {
                    canPass = false;
                    todo_interaction.channel
                        .send({
                            content: lang.todo.newtodo.errors.title_missing,
                        })
                        .then(async (msg) => {
                            await delay(3000);
                            msg.delete().catch((err) => {});
                        });
                    decrease_toDoAddCount(main_interaction.user.id);
                }

                if (canPass) {
                    var sqlQuery;

                    if (isNewTask) {
                        sqlQuery = `INSERT INTO ${config.tables.mido_todo} (user_id, title, text, deadline, other_user, cat_id, guild_id, state, reminder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                    } else {
                        sqlQuery = `UPDATE ${config.tables.mido_todo} SET title = ?, text = ?, deadline = ?, other_user = ?, reminder = ? WHERE id = ?`;
                    }

                    await database
                        .query(
                            sqlQuery,
                            isNewTask
                                ? [
                                      main_interaction.user.id,
                                      title,
                                      text,
                                      deadline,
                                      user,
                                      getCurrentProjectId(main_interaction.user.id),
                                      main_interaction.member.guild.id,
                                      toDoState_Active,
                                      reminder,
                                  ]
                                : [title, text, deadline, user, reminder, toDoId]
                        )
                        .then(async () => {
                            errorhandler({
                                err: '',
                                message: `ToDo ${isNewTask ? 'added' : 'updated'} UserID ${
                                    main_interaction.user.id
                                } | GuildID: ${main_interaction.guild.id}`,
                                fatal: false,
                            });
                            createLog({
                                type: isNewTask ? 0 : 1,
                                data: {
                                    title: isNewTask
                                        ? title
                                        : old_title !== title
                                        ? old_title + ' ➡️ ' + title
                                        : title,
                                    text: isNewTask
                                        ? text
                                        : old_text !== text
                                        ? old_text + ' ➡️ ' + text
                                        : text,
                                    deadline: isNewTask
                                        ? deadline
                                        : old_deadline !== deadline
                                        ? old_deadline + ' ➡️ ' + deadline
                                        : deadline,
                                    reminder: isNewTask
                                        ? reminder
                                        : old_reminder !== reminder
                                        ? old_reminder + ' ➡️ ' + reminder
                                        : reminder,
                                    other_user: isNewTask
                                        ? user
                                        : old_user !== user
                                        ? old_user + ' ➡️ ' + user
                                        : user,
                                    id: isNewTask ? undefined : toDoId,
                                },
                                user: main_interaction.user,
                                guild: main_interaction.guild,
                            });
                            if (user.length > 0) {
                                user = removeMention(user);
                                user = user.split(' ');
                                for (let i in user) {
                                    main_interaction.guild.members.fetch(user[i]).then((user) => {
                                        if (user) {
                                            try {
                                                user.send({
                                                    content: `${lang.todo.got_mentioned} - **${title}**`,
                                                }).catch((err) => {});
                                            } catch (err) {}
                                        }
                                    });
                                }
                            }

                            await todo_interaction.channel
                                .send({
                                    content: lang.todo.newtodo.success.saved,
                                })
                                .then(async (msg) => {
                                    await delay(3000);
                                    msg.delete().catch((err) => {});
                                    manageTask.delete().catch((err) => {});
                                    decrease_toDoInteractionCount(main_interaction.user.id);
                                    decrease_toDoAddCount(main_interaction.user.id);

                                    const refresh = await refreshProject_ToDo(main_interaction);
                                    const categories = refresh[0];
                                    const todo = refresh[1];
                                    const newToDoList = await viewToDoList(
                                        categories,
                                        todo,
                                        main_interaction
                                    );
                                    await main_interaction.message.edit({
                                        embeds: [newToDoList],
                                    });
                                });
                        })
                        .catch(async (err) => {
                            errorhandler({ err, fatal: true });
                            await todo_interaction.channel
                                .send({
                                    content: lang.todo.newtodo.errors.save_error,
                                })
                                .then(async (msg) => {
                                    await delay(3000);
                                    msg.delete().catch((err) => {});
                                });
                            decrease_toDoAddCount(main_interaction.user.id);
                        });
                }
                break;

            case 'next':
                await todo_interaction.message.edit({
                    components: [
                        new ActionRowBuilder({
                            components: [
                                newToDoButtons(main_interaction, true, lang)[0],
                                newToDoButtons(main_interaction, true, lang)[1],
                                newToDoButtons(main_interaction, true, lang)[2],
                            ],
                        }),
                    ],
                });
                decrease_toDoAddCount(main_interaction.user.id);
                break;

            case 'cancel':
                decrease_toDoInteractionCount(main_interaction.user.id);
                decrease_toDoAddCount(main_interaction.user.id);
                await todo_interaction.message.delete().catch((err) => {});
                newToDocollector = null;
                todo_interaction = null;
                break;

            case 'back':
                await todo_interaction.message.edit({
                    components: [
                        new ActionRowBuilder({
                            components: [
                                newToDoButtons(main_interaction, false, lang)[0],
                                newToDoButtons(main_interaction, false, lang)[1],
                                newToDoButtons(main_interaction, false, lang)[2],
                                newToDoButtons(main_interaction, false, lang)[3],
                                newToDoButtons(main_interaction, false, lang)[4],
                            ],
                        }),
                    ],
                });
                decrease_toDoAddCount(main_interaction.user.id);
                break;
        }

        var messageCollector = await main_interaction.message.channel.createMessageCollector({
            filter: (user) => user.author.id === main_interaction.user.id,
            max: 1,
        });

        messageCollector.on('collect', async (reply) => {
            var customId;
            try {
                customId = todo_interaction.customId.split(' ')[0];
            } catch (e) {
                return;
            }
            switch (customId) {
                case 'add_title':
                    if (
                        reply.content.toLowerCase() === 'cancel' ||
                        reply.content.toLowerCase() === 'none'
                    ) {
                        decrease_toDoAddCount(main_interaction.user.id);
                        reply.delete().catch((err) => {});
                        todo_interaction_reply.delete().catch((err) => {});
                        return;
                    }

                    title = reply.content;
                    try {
                        await manageTask.edit({
                            embeds: [newToDoEmbed(title, text, deadline, user)],
                        });
                        decrease_toDoAddCount(main_interaction.user.id);
                    } catch (err) {
                        if (err.code == '50035') {
                            //String too long
                            reply
                                .reply({
                                    content: lang.todo.newtodo.errors.title_tolong,
                                })
                                .then(async (msg) => {
                                    await delay(4000);
                                    msg.delete().catch((err) => {});
                                });
                        }
                    }
                    reply.delete().catch((err) => {});
                    todo_interaction_reply.delete().catch((err) => {});
                    decrease_toDoAddCount(main_interaction.user.id);
                    break;

                case 'add_text':
                    if (
                        reply.content.toLowerCase() === 'cancel' ||
                        reply.content.toLowerCase() === 'none'
                    ) {
                        decrease_toDoAddCount(main_interaction.user.id);
                        reply.delete().catch((err) => {});
                        todo_interaction_reply.delete().catch((err) => {});
                        return;
                    }

                    text = reply.content;
                    try {
                        manageTask.edit({
                            embeds: [newToDoEmbed(title, text, deadline, user)],
                        });
                    } catch (err) {
                        if (err.code == '50035') {
                            //String too long
                            reply
                                .reply({
                                    content: lang.todo.newtodo.errors.text_tolong,
                                })
                                .then(async (msg) => {
                                    await delay(4000);
                                    msg.delete().catch((err) => {});
                                    reply.delete().catch((err) => {});
                                    todo_interaction_reply.delete().catch((err) => {});
                                    decrease_toDoAddCount(main_interaction.user.id);
                                });
                        }
                    }
                    reply.delete().catch((err) => {});
                    todo_interaction_reply.delete().catch((err) => {});
                    decrease_toDoAddCount(main_interaction.user.id);
                    break;

                case 'add_deadline':
                    if (
                        reply.content.toLowerCase() === 'cancel' ||
                        reply.content.toLowerCase() === 'none'
                    ) {
                        decrease_toDoAddCount(main_interaction.user.id);
                        reply.delete().catch((err) => {});
                        todo_interaction_reply.delete().catch((err) => {});
                        return;
                    }

                    deadline = reply.content;
                    deadline = deadline.split('.');

                    let day = deadline[0];
                    let month = deadline[1];
                    let year =
                        deadline[2] === ' ' || deadline[2] === undefined || deadline[2] === ''
                            ? new Date().getFullYear().toString()
                            : deadline[2];

                    let date = new Date(JSON.stringify(`${year}-${month}-${day}`));

                    await delay(1000);

                    if (JSON.stringify(date) != 'null') {
                        deadline = `${day}.${month}.${year}`;
                        dateFormatDC = ` <t:${Math.floor(date / 1000)}:R>`;

                        reply.delete().catch((err) => {});
                        todo_interaction_reply.delete().catch((err) => {});

                        const reminderMessage = await reply.channel.send(
                            lang.todo.newtodo.interaction.add_reminder
                        );
                        const collector = main_interaction.message.channel.createMessageCollector({
                            max: 1,
                            time: 30000,
                            filter: (user) => user.author.id === main_interaction.user.id,
                        });

                        await collector.on('collect', async (reply) => {
                            reminder = reply.content;

                            if (reminder.toLowerCase() === 'none') {
                                decrease_toDoAddCount(main_interaction.user.id);
                                reply.delete().catch((err) => {});
                                return reminderMessage.delete().catch((err) => {});
                            }
                            try {
                                reminder = reminder.split(' ');
                            } catch (err) {
                                return reply
                                    .reply(lang.todo.newtodo.errors.no_space_in_reminder)
                                    .then(async (msg) => {
                                        await delay(3000);
                                        reply.delete().catch((err) => {});
                                        msg.delete().catch((err) => {});
                                        reminderMessage.delete().catch((err) => {});
                                        decrease_toDoAddCount(main_interaction.user.id);
                                    });
                            }

                            try {
                                var date = reminder[0].split('.');
                                var time = reminder[1].split(':');
                            } catch (err) {
                                return reply
                                    .reply(lang.todo.newtodo.errors.no_point_comma_in_reminder)
                                    .then(async (msg) => {
                                        await delay(3000);
                                        reply.delete().catch((err) => {});
                                        msg.delete().catch((err) => {});
                                        reminderMessage.delete().catch((err) => {});
                                        decrease_toDoAddCount(main_interaction.user.id);
                                    });
                            }

                            if (!date[2]) date[2] = new Date().getFullYear().toString();
                            let checkDate = new Date(
                                date[2],
                                Number(date[1]) - 1,
                                date[0],
                                time[0],
                                time[1]
                            );
                            console.log(checkDate);
                            await delay(1000);
                            if (JSON.stringify(checkDate) != 'null') {
                                reminder = `${date[0]}.${date[1]}.${date[2]} ${time[0]}:${time[1]}`;
                                reminderFormatDC = ` <t:${Math.floor(checkDate / 1000)}:R>`;
                            } else {
                                return reply
                                    .reply(lang.todo.newtodo.errors.reminder_wrong_date_format)
                                    .then(async (msg) => {
                                        await delay(3000);
                                        decrease_toDoAddCount(main_interaction.user.id);
                                        reply.delete().catch((err) => {});
                                        reminderMessage.delete().catch((err) => {});
                                        msg.delete().catch((err) => {});
                                    });
                            }

                            manageTask
                                .edit({
                                    embeds: [
                                        newToDoEmbed(
                                            title,
                                            text,
                                            deadline +
                                                dateFormatDC +
                                                `\n🕐 **${lang.todo.reminder}:** ${reminder} ${reminderFormatDC}`,
                                            user
                                        ),
                                    ],
                                })
                                .then(async () => {
                                    await delay(1000);
                                    reminderMessage.delete().catch((err) => {});
                                    reply.delete().catch((err) => {});
                                    todo_interaction_reply.delete().catch((err) => {});
                                    decrease_toDoAddCount(main_interaction.user.id);
                                })
                                .catch(async (err) => {
                                    await delay(1000);
                                    reminderMessage.delete().catch((err) => {});
                                    reply.delete().catch((err) => {});
                                    todo_interaction_reply.delete().catch((err) => {});
                                    decrease_toDoAddCount(main_interaction.user.id);
                                });
                        });

                        manageTask.edit({
                            embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)],
                        });
                    } else {
                        reply.channel
                            .send({
                                content: lang.todo.newtodo.errors.reminder_wrong_date_format,
                            })
                            .then(async (msg) => {
                                await delay(3000);
                                msg.delete().catch((err) => {});
                                reply.delete().catch((err) => {});
                                todo_interaction_reply.delete().catch((err) => {});
                                decrease_toDoAddCount(main_interaction.user.id);
                            });
                    }

                    break;

                case 'add_other':
                    if (
                        reply.content.toLowerCase() === 'cancel' ||
                        reply.content.toLowerCase() === 'none'
                    ) {
                        decrease_toDoAddCount(main_interaction.user.id);
                        reply.delete().catch((err) => {});
                        todo_interaction_reply.delete().catch((err) => {});
                        return;
                    }

                    let other_user = reply.content.split(' ');

                    for (let i in other_user) {
                        other_user[i] = removeMention(other_user[i]);

                        try {
                            other_user[i] = main_interaction.message.guild.members.cache.find(
                                (member) => member.id.includes(other_user[i])
                            ).user;
                        } catch (err) {
                            reply.channel
                                .send({
                                    content: lang.errors.user_notfound,
                                })
                                .then(async (msg) => {
                                    await delay(3000);
                                    msg.delete().catch((err) => {});
                                    decrease_toDoAddCount(main_interaction.user.id);
                                });
                            i = other_user.length;
                            continue;
                        }

                        user += `${other_user[i]} `;
                    }
                    manageTask
                        .edit({
                            embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)],
                        })
                        .then(() => {
                            reply.delete().catch((err) => {});
                            todo_interaction_reply.delete().catch((err) => {});
                            decrease_toDoAddCount(main_interaction.user.id);
                        });
                    break;

                default:
                    break;
            }
        });
    });
};
