module.exports.guildScheduledEventCreate = (bot) => {
    bot.on('guildScheduledEventCreate', async (event) => {
        console.log(event);
    });
};
