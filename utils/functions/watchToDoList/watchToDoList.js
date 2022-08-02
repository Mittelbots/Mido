const database = require("../../../bot/db/db");
const {
    toDoState_Inactive
} = require("../../variables/variables");
const {
    errorhandler
} = require("../errorhandler/errorhandler");
const { getLang } = require("../getData/getLang");
const config = require('../../assets/json/_config/config.json');

module.exports.watchToDoList = (bot) => {
    setInterval(async () => {
        var count = 0;
        var dmCount = 0;
        var failedCount = 0;

        await database.query(`SELECT * FROM ${config.tables.mido_todo} WHERE state = ?`, ['1'])
            .then(res => {
                if (res.length <= 0) return;

                res.map(async task => {
                    var deadline = task.deadline.split(".");

                    var deadlineTime = new Date(deadline[2], deadline[1], deadline[0]);
                    deadlineTime.setMonth(deadlineTime.getMonth() - 1)
                    deadlineTime.setDate(deadlineTime.getDate() + 1)
                    

                    var currentTime = new Date();

                    if (currentTime.getTime() <= deadlineTime.getTime()) { //DeadLine passed

                        const lang = require(`../../assets/json/language/${await getLang(task.guild_id)}.json`)

                        const taskid = task.id;
                        const user = task.user_id;
                        const title = task.title;
                        const text = task.text;
                        const other_user = task.other_user;
                        const project_id = task.cat_id;
                        const guild = await bot.guilds.cache.get(task.guild_id);
                        const message = `${lang.todo.watchToDoList.message.the_task} **${title}** ${lang.todo.watchToDoList.message.last}`;


                        task.reminder = task.reminder.split(" ");
                        var reminderDate = task.reminder[0].split(".");
                        var reminderTime = task.reminder[1].split(":");

                        reminderDate = new Date(deadline[2], deadline[1], deadline[0], reminderTime[0], reminderTime[1]);
                        reminderDate.setMonth(reminderDate.getMonth() - 1)
                        reminderDate.setDate(reminderDate.getDate() + 1)

                        console.log(reminderDate)

                        if (reminderDate && currentTime.getTime() <= reminderDate.getTime()) {
                            return sendMessageToUser();
                        }

                        if (!reminderDate) return sendMessageToUser();

                        async function sendMessageToUser() {
                            try {
                                if (other_user) {
                                    other_user = removeMention(other_user);
                                    other_user = other_user.split(" ");
                                    for(let i in other_user) {
                                        let dm_other_user = bot.users.cache.get(other_user[i]);
                                        dm_other_user.send(message).catch(err => {})
                                        dmCount++;
                                    }
                                }
                            } catch (err) {
                                //!Cant find user in cache or user has dm closed
                                failedCount++;
                            }
                            try {
                                var dm_todo_owner = bot.users.cache.get(user)
                                dm_todo_owner.send(message).catch(err => {})
                                dmCount++;
                            } catch (err) {
                                //!Cant find user in cache or user has dm closed
                                failedCount++;
                            }

                            await database.query(`UPDATE ${config.tables.mido_todo} SET state = ? WHERE id = ?`, [toDoState_Inactive, taskid])
                                .catch(err => {
                                    return errorhandler({err, fatal: true})
                                });

                            count++;
                        }
                    }
                })
            }).catch(err => {
                return errorhandler({err, fatal: true})
            });
        errorhandler({err: `${count} tasks successfully passed the deadline & ${dmCount} DM's successfully sent. [I coudn't sent a DM to ${failedCount} users.]`, fatal: false})
    }, 10000); // 10 MIN |  600000
}