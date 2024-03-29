const database = require('../../../../bot/db/db');
const {
    increase_toDoInteractionCount,
    decrease_toDoInteractionCount,
    toDoState_Ready,
    getCurrentProjectId,
    changeCurrentProjectId,
} = require('../../../variables/variables');
const { delay } = require('../../delay/delay');
const { errorhandler } = require('../../errorhandler/errorhandler');
const { getLang } = require('../../getData/getLang');
const { refreshProject_ToDo } = require('../../getData/refreshProject_ToDo');
const { editToDoList } = require('../editToDoList/editToDoList');
const config = require('../../../assets/json/_config/config.json');
const { createLog } = require('../../log/mido_log');
const { hasPermissions } = require('../../hasPermissions/hasPermissions');

module.exports = async ({ main_interaction }) => {
    const lang = require(`../../../assets/json/language/${await getLang(
        main_interaction.guild.id
    )}.json`);

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            view_tasks: 1,
            edit_tasks: 1,
        },
    });

    if (!hasPerms) {
        return main_interaction.message.reply(lang.errors.noperms).then(async (msg) => {
            await delay(2000);
            await msg.delete().catch((err) => {});
        });
    }

    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    if (!getCurrentProjectId(main_interaction.user.id))
        changeCurrentProjectId(main_interaction.customId.split('_')[1], main_interaction.user.id);

    var set_todo_ready_Message = await main_interaction.channel.send({
        content: `${lang.todo.set_todo_ready.interaction.insert_id} ${lang.tips.cancel}`,
        ephemeral: true,
    });

    var messageCollectorDeleteToDo = await main_interaction.message.channel.createMessageCollector({
        filter: (user) => user.author.id === main_interaction.user.id,
        time: 15000,
        max: 1,
    });

    messageCollectorDeleteToDo.on('collect', async (reply) => {
        if (reply.content.toLowerCase() === 'cancel') {
            await reply
                .reply({
                    content: lang.errors.canceled,
                })
                .then(async (msg) => {
                    await delay(3000);
                    msg.delete().catch((err) => {});
                    decrease_toDoInteractionCount(main_interaction.user.id);
                    reply.delete().catch((err) => {});
                    set_todo_ready_Message.delete().catch((err) => {});
                });

            return;
        }
        if (isNaN(reply.content)) {
            return reply
                .reply({
                    content: lang.errors.only_numbers,
                })
                .then(async (msg) => {
                    await delay(3000);
                    msg.delete().catch((err) => {});
                    decrease_toDoInteractionCount(main_interaction.user.id);
                    reply.delete().catch((err) => {});
                    set_todo_ready_Message.delete().catch((err) => {});
                });
        } else {
            const task = await database
                .query(`SELECT * FROM ${config.tables.mido_todo} WHERE id = ? AND guild_id = ?`, [
                    reply.content,
                    main_interaction.message.guild.id,
                ])
                .then((res) => {
                    return res[0];
                })
                .catch((err) => console.log(err));

            if (task) {
                if (task.id === reply.content) {
                    decrease_toDoInteractionCount(main_interaction.user.id);
                    return reply.reply(lang.errors.task_already_ready).then(async (msg) => {
                        await delay(2000);
                        decrease_toDoInteractionCount(main_interaction.user.id);
                        msg.delete().catch((err) => {});
                        reply.delete().catch((err) => {});
                        set_todo_ready_Message.delete().catch((err) => {});
                    });
                }
                return await database
                    .query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [
                        toDoState_Ready,
                        reply.content,
                    ])
                    .then(async () => {
                        errorhandler({
                            err: '',
                            message: `ToDo set to ready UserID ${main_interaction.user.id} | GuildID: ${main_interaction.guild.id}`,
                            fatal: false,
                        });
                        createLog({
                            type: 3,
                            data: {
                                title: task.title,
                                text: task.text,
                                deadline: task.deadline,
                                reminder: task.reminder,
                                other_user: task.other_user,
                                id: task.id,
                            },
                            user: main_interaction.user,
                            guild: main_interaction.guild,
                        });

                        return reply
                            .reply({
                                content: lang.success.set_to_read,
                            })
                            .then(async (msg) => {
                                await delay(3000);

                                const refresh = await refreshProject_ToDo(main_interaction);
                                let projects = refresh[0];
                                let todo = refresh[1];
                                await editToDoList(projects, todo, main_interaction, true);

                                decrease_toDoInteractionCount(main_interaction.user.id);
                                msg.delete().catch((err) => {});
                                reply.delete().catch((err) => {});
                                set_todo_ready_Message.delete().catch((err) => {});
                            });
                    })
                    .catch((err) => {
                        errorhandler({ err, fatal: true });
                        return reply
                            .reply({
                                content: lang.todo.set_todo_ready.errors.set_todo_ready_error,
                            })
                            .then(async (msg) => {
                                await delay(3000);
                                msg.delete().catch((err) => {});
                                decrease_toDoInteractionCount(main_interaction.user.id);
                                reply.delete().catch((err) => {});
                                set_todo_ready_Message.delete().catch((err) => {});
                            });
                    });
            } else {
                return reply
                    .reply({
                        content: lang.todo.set_todo_ready.errors.item_notfound_withId,
                    })
                    .then(async (msg) => {
                        await delay(50000);
                        msg.delete().catch((err) => {});
                        decrease_toDoInteractionCount(main_interaction.user.id);
                        reply.delete().catch((err) => {});
                        set_todo_ready_Message.delete().catch((err) => {});
                    });
            }
        }
    });
};
