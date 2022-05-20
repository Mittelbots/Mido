
const { increase_toDoInteractionCount, decrease_toDoInteractionCount, toDoState_Deleted, getCurrentProjectId, changeCurrentProjectId } = require("../../../variables/variables");
const { delay } = require("../../delay/delay");
const { getLang } = require("../../getData/getLang");
const { refreshProject_ToDo } = require("../../getData/refreshProject_ToDo");
const { editToDoList } = require("../editToDoList/editToDoList");

const config = require("../../../assets/json/_config/config.json");
const database = require("../../../../bot/db/db");
const { createLog } = require("../../log/mido_log");
const { hasPermissions } = require("../../hasPermissions/hasPermissions");

module.exports = async ({main_interaction}) => {

    const lang = require(`../../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            view_tasks: 1,
            edit_tasks: 1,
        }
    });

    if(!hasPerms) {
        return main_interaction.message.reply(lang.errors.noperms)
            .then(async msg => {
                await delay(2000);
                await msg.delete().catch(err => {})
            })
    }

    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    if(!getCurrentProjectId(main_interaction.user.id)) changeCurrentProjectId(main_interaction.customId.split('_')[1], main_interaction.user.id)

    var del_todoMessage = await main_interaction.channel.send({
        content: `${lang.todo.delete_todo.interaction.insert_id} ${lang.tips.cancel}`
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
                decrease_toDoInteractionCount(main_interaction.user.id);
                reply.delete().catch(err => {})
                del_todoMessage.delete().catch(err => {})
                msg.delete().catch(err => {})
            });

            return;
        }
        if (isNaN(reply.content)) {
            return reply.reply({
                content: lang.errors.only_numbers
            }).then(async msg => {
                await delay(3000);
                decrease_toDoInteractionCount(main_interaction.user.id);
                reply.delete().catch(err => {})
                msg.delete().catch(err => {})
                del_todoMessage.delete().catch(err => {})
            })
        } else {
            const task = await database.query(`SELECT * FROM ${config.tables.mido_todo} WHERE id = ?`, [reply.content])
                .then(res => {
                    return res[0]
                })
                .catch(err => console.log(err));

            if (task) {
                return await database.query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [toDoState_Deleted, reply.content])
                    .then(async () => {

                        createLog({
                            type: 2,
                            data: {
                                title: task.title,
                                text: task.text,
                                deadline: task.deadline,
                                reminder: task.reminder,
                                other_user: task.other_user,
                                id: task.id,
                            },
                            user: main_interaction.user,
                            guild: main_interaction.guild
                        })

                        return reply.reply({
                            content: lang.success.deleted
                        }).then(async msg => {
                            await delay(3000);

                            const refresh = await refreshProject_ToDo(main_interaction);
                            let projects = refresh[0];
                            let todo = refresh[1];

                            await editToDoList(projects, todo, main_interaction, true);

                            decrease_toDoInteractionCount(main_interaction.user.id);
                            reply.delete().catch(err => {})
                            msg.delete().catch(err => {})
                            del_todoMessage.delete().catch(err => {})
                        })
                    })
                    .catch(err => {
                        errorhandler({err, fatal: true});
                        return reply.reply({
                            content: lang.todo.delete_todo.errors.delete_todo_error
                        }).then(async msg => {
                            await delay(3000);
                            decrease_toDoInteractionCount(main_interaction.user.id);
                            reply.delete().catch(err => {})
                            msg.delete().catch(err => {})
                            del_todoMessage.delete().catch(err => {})
                        })
                    })
            } else {
                return reply.reply({
                    content: lang.todo.delete_todo.errors.item_notfound_withId
                }).then(async msg => {
                    await delay(3000);
                    decrease_toDoInteractionCount(main_interaction.user.id);
                    reply.delete().catch(err => {});
                    msg.delete().catch(err => {});
                    del_todoMessage.delete().catch(err => {});
                })
            }
        }
    });
}