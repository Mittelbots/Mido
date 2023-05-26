const { ownerCommands } = require('../../src/commands/owner/owner');
const { ChannelType } = require('discord.js');

async function messageCreate(message, bot) {
    if (message.author.bot || message.author.system) return;
    if (message.channel.type === ChannelType.DM) {
        ownerCommands(bot, message);
        return;
    }
}

module.exports = {
    messageCreate,
};
