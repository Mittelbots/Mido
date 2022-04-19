
const { increase_toDoInteractionCount, decrease_toDoInteractionCount, toDoState_Deleted, getCurrentProjectId, changeCurrentProjectId } = require("../../../variables/variables");
const { delay } = require("../../delay/delay");
const { getLang } = require("../../getData/getLang");
const { refreshProject_ToDo } = require("../../getData/refreshProject_ToDo");
const { editToDoList } = require("../editToDoList/editToDoList");

const config = require("../../../assets/json/_config/config.json");
const database = require("../../../../bot/db/db");

module.exports = async ({main_interaction}) => {
    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    if(!getCurrentProjectId()) changeCurrentProjectId(main_interaction.customId.split('_')[1])

    const lang = require(`../../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)

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
                decrease_toDoInteractionCount(main_interaction.user.id);
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
                return await database.query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [toDoState_Deleted, reply.content])
                    .then(async () => {
                        return reply.reply({
                            content: lang.success.deleted
                        }).then(async msg => {
                            await delay(3000);

                            const refresh = await refreshProject_ToDo(main_interaction);
                            let projects = refresh[0];
                            let todo = refresh[1];

                            await editToDoList(projects, todo, main_interaction, true);

                            decrease_toDoInteractionCount(main_interaction.user.id);
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
                            decrease_toDoInteractionCount(main_interaction.user.id);
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
                    decrease_toDoInteractionCount(main_interaction.user.id);
                    reply.delete();
                    msg.delete();
                    del_todoMessage.delete();
                })
            }
        }
    });
}