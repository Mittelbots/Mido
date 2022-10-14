const { ActivityType } = require('discord.js');
const { getLinesOfCode } = require('../getLinesOfCode/getLinesOfCode');
const activity = require('../../assets/json/activity/activity.json');
const { errorhandler } = require('../errorhandler/errorhandler');

module.exports.setActivity = (bot) => {
    getLinesOfCode((cb) => {
        let membersCount = bot.guilds.cache
            .map((guild) => guild.memberCount)
            .reduce((a, b) => a + b, 0);
        var codeLines =
            ` | ${bot.guilds.cache.size} guilds with ${membersCount} members | Code: ${cb}` || '';
        bot.user.setActivity({
            name: activity.name + ' v' + bot.version + codeLines,
            type: ActivityType.Playing,
        });
        errorhandler({
            err: '------------BOT ACTIVITY SUCCESSFULLY STARTED------------' + new Date(),
            fatal: false,
        });
    });
};
