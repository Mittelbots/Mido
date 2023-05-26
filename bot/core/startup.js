const { setActivity } = require("../../utils/functions/activity/setActivity");
const { createSlashCommands, loadCommandList } = require("../../utils/functions/createSlashCommands/createSlashCommands");
const database = require("../db/db");

module.exports.startBot = async (bot) => {
    return new Promise(async (resolve, reject) => {
        try {
            await database.init();
            await setActivity(bot);
            await Promise.resolve(this.fetchCache(bot));
           
            bot.commands = (await loadCommandList(bot)).cmd;

            setActivity(bot);
            if (process.env.NODE_ENV === 'production') {
                await createSlashCommands();
            }

            console.info(
                `****Ready! Logged in as ${bot.user.username}! I'm on ${bot.guilds.cache.size} Server(s)****`
            );

            return resolve(true);
        } catch (err) {
            return reject(err);
        }
    });
};

module.exports.fetchCache = async (bot) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.info(`Starting to fetch ${bot.guilds.cache.size} guilds...`);
            console.time(`Fetching guilds in:`);
            const guilds = await bot.guilds.fetch();
            console.timeEnd('Fetching guilds in:');

            //console.time('Checking data in database:');
            //await this.checkGuildsInDatabase(guilds);

            console.timeEnd('Checking data in database:');

            console.time('Fetching users in:');
            await Promise.resolve(this.fetchUsers(bot, guilds));
            console.timeEnd('Fetching users in:');

            return resolve(true);
        } catch (err) {
            return reject(err);
        }
    });
};

module.exports.fetchUsers = async (bot, guilds) => {
    return new Promise(async (resolve, reject) => {
        let i = 0;
        let length = guilds.size;

        await guilds.map(async (guild) => {
            await bot.guilds.cache
                .get(guild.id)
                .members.fetch()
                .then(() => {
                    console.info(`Members from ${guild.name}(${guild.id}) successfully fetched`);
                    i = i + 1;
                });
            if (i === length) {
                return resolve(true);
            }
        });
    });
};