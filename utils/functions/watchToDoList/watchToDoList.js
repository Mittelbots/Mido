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
                    var deadlineTime = new Date(task.deadline)
                    var currentTime = new Date();
                    
                    if (currentTime.getTime() >= deadlineTime.getTime()) { //DeadLine passed

                        const lang = require(`../../assets/json/language/${await getLang(task.guild_id)}.json`)

                        const taskid = task.id;
                        const user = task.user_id;
                        const title = task.title;
                        const text = task.text;
                        const other_user = task.other_user;
                        const project_id = task.cat_id;
                        const reminderDate = new Date(task.reminder);
                        const guild = await bot.guilds.cache.get(task.guild_id);
                        const message = `${lang.todo.watchToDoList.message.the_task} ${title} ${lang.todo.watchToDoList.message.last}`;

                        if (reminderDate && currentTime.getTime() >= reminderDate.getTime()) {
                            return sendMessageToUser();
                        }

                        if (!reminderDate) return sendMessageToUser();

                        async function sendMessageToUser() {
                            try {
                                if (other_user) {
                                    var dm_other_user = bot.users.cache.get(other_user);
                                    dm_other_user.send(message);
                                    dmCount++;
                                }
                            } catch (err) {
                                //!Cant find user in cache or user has dm closed
                                failedCount++;
                            }
                            try {
                                var dm_todo_owner = guild.members.cache.find(member => member.id.includes(user)).user
                                dm_todo_owner.send(message);
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

        console.info(`${count} tasks successfully passed the deadline & ${dmCount} DM's successfully sent. [I coudn't sent a DM to ${failedCount} users.]`)
    }, 600000); // 10 MIN |  600000
}