const config = require('../../../utils/assets/json/_config/config.json');
const { delay } = require('../../../utils/functions/delay/delay');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = async ({main_interaction, bot}) => {
    main_interaction.reply({
        content: 'Pong!',
        ephemeral: true
    });
    await delay(1000);
    return main_interaction.editReply(`Latency is ${Date.now() - main_interaction.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`);
}

module.exports.data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Replies the ping')