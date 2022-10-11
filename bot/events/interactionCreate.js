const { InteractionType } = require("discord.js");
const { handleSlashCommands } = require("../../src/slash_commands");
const { isUserPremium } = require("../../utils/functions/premium/premium");
const { ProjectInteraction } = require("../../utils/functions/toDoList/ProjectInteraction");

module.exports.interactionCreate = (bot) => {
    bot.on('interactionCreate', async (main_interaction) => {
        if(main_interaction.type === InteractionType.ApplicationCommand) {
            const isPremium = await isUserPremium({user_id: main_interaction.user.id});

            if(isPremium.error) return main_interaction.reply({
                content: isPremium.message,
                ephemeral: true
            });

            handleSlashCommands({
                main_interaction,
                bot,
                isPremium: isPremium.premium,
                isPlatin: isPremium.platin
            })
        }else {
            await main_interaction.deferUpdate();
            try {
                ProjectInteraction(main_interaction)
            } catch (err) {}
        }
    });
}