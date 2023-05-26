const {
    createSlashCommands,
} = require('../../../utils/functions/createSlashCommands/createSlashCommands');

module.exports.ownerCommands = async (bot, message) => {
    if (message.author.id !== bot.config.Bot_Owner_ID) return;

    switch (message.content.toLowerCase()) {
        case 'deploycommands':
            createSlashCommands();
            message.reply({
                content: 'Commands deployed!',
            });
            break;
    }
};
