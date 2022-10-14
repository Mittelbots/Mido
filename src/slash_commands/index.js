const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');

module.exports.handleSlashCommands = async ({ main_interaction, bot, isPremium, isPlatin }) => {
    require(`./${main_interaction.commandName}/${main_interaction.commandName}`).run({
        main_interaction: main_interaction,
        bot: bot,
        isPremium: isPremium,
        isPlatin: isPlatin,
    });
    errorhandler({
        err: '',
        message: `${main_interaction.commandName} Command fired UserID: ${main_interaction.user.id} | isPremium: ${isPremium} | isPlatin: ${isPlatin}`,
        fatal: false,
    });
};
