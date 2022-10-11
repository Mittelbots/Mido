const { delay } = require('../../../utils/functions/delay/delay');
const { SlashCommandBuilder } = require('discord.js');

module.exports.run = async ({main_interaction, bot}) => {
    main_interaction.reply({
        content: 'Pong!',
        ephemeral: true
    }).catch(err => {});
    await delay(1000);
    return main_interaction.editReply(`Latency is ${Date.now() - main_interaction.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`).catch(err => {});
}

module.exports.data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies the ping')