const { SlashCommandBuilder } = require('discord.js');
const { getLang } = require('../../../utils/functions/getData/getLang');
const {
    decrease_toDoInteractionCount,
    decrease_toDoAddCount,
} = require('../../../utils/variables/variables');

module.exports.run = async ({ main_interaction, bot }) => {
    const lang = require(`../../../utils/assets/json/language/${await getLang(
        main_interaction.guild.id
    )}.json`);

    decrease_toDoInteractionCount(main_interaction.user.id);
    decrease_toDoAddCount(main_interaction.user.id);

    return main_interaction
        .reply({
            content: lang.resetCount.success,
            ephemeral: true,
        })
        .catch((err) => {});
};

module.exports.data = new SlashCommandBuilder()
    .setName('resetcount')
    .setDescription("Reset your Count if it's not working and you can't press any buttons");
