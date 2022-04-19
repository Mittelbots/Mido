const { MessageActionRow } = require("discord.js");
const { addOptionButtons } = require("../addButtonsToList");

module.exports = async ({main_interaction}) => {
    const optionsButtons = await addOptionButtons(main_interaction.message.guild.id);
    main_interaction.message.edit({
        components: [new MessageActionRow({
            components: [...optionsButtons]
        })]
    });
}