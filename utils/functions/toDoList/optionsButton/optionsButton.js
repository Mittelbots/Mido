const { MessageActionRow } = require("discord.js");
const { addOptionButtons } = require("../addButtonsToList");

module.exports = async (params) => {
    var main_interaction = params.main_interaction;

    const optionsButtons = await addOptionButtons(main_interaction.message.guild.id);
    main_interaction.message.edit({
        components: [new MessageActionRow({
            components: [optionsButtons[0], optionsButtons[1], optionsButtons[2], optionsButtons[3]]
        })]
    });
}