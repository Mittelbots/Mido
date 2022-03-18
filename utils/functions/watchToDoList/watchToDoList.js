const database = require("../../../bot/db/db");
const {
    toDoState_Inactive
} = require("../../variables/variables");
const {
    errorhandler
} = require("../errorhandler/errorhandler");

module.exports.watchToDoList = (bot) => {
    setInterval(async () => {
        var count = 0;
        var dmCount = 0;
        var failedCount = 0;

        await database.query('SELECT * FROM hn_todo WHERE state = ?', ['1'])
            .then(res => {
                if (res.length <= 0) return;

                res.map(async task => {
                    var deadlineTime = new Date(task.deadline)
                    var currentTime = new Date();
                    
                    if (currentTime.getTime() >= deadlineTime.getTime()) { //DeadLine passed
                        const taskid = task.id;
                        const user = task.user_id;
                        const title = task.title;
                        const text = task.text;
                        const other_user = task.other_user;
                        const project_id = task.cat_id;
                        const reminderDate = new Date(task.reminder);
                        const guild = await bot.guilds.cache.get(task.guild_id);
                        const message = `Die Task ${title} hat heute die Deadline! Noch nicht fertig? Dann mach dich mal an die Arbeit!`;

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

                            await database.query(`UPDATE hn_todo SET state = ? WHERE id = ?`, [toDoState_Inactive, taskid])
                                .catch(err => {
                                    return errorhandler(err)
                                });

                            count++;
                        }
                    }
                })
            }).catch(err => {
                return errorhandler(err)
            });

        console.info(`${count} tasks successfully passed the deadline & ${dmCount} DM's successfully sent. [I coudn't sent a DM to ${failedCount} users.]`)
    }, 600000); // 10 MIN |  600000
}