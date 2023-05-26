const { EmbedBuilder } = require('discord.js');
const { guildCreate } = require('./guildCreate');
const { messageCreate } = require('./messageCreate');
const { welcome_message } = require('../../utils/functions/welcome_message/welcome_message');

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

    bot.on('guildCreate', async (guild) => {
        return await guildCreate({ guild, bot });
    });

    bot.on('messageCreate', (message) => {
        return messageCreate(message, bot);
    });

    bot.on('guildMemberAdd', async (member) => {
        return await welcome_message(member);
    });
};
