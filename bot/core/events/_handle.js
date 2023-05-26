const { EmbedBuilder } = require("discord.js");

module.exports.acceptBotInteraction = (bot) => {
    bot.on('debug', (debug) => {
        const message = new EmbedBuilder().setDescription(`**Debug info: ** \n ${debug}`);

        // bot.guilds.cache
        //     .get(config.debug_info.debug_server)
        //     .channels.cache.get(config.debug_info.debug_channel)
        //     .send({
        //         embeds: [Message],
        //     });
    });


};