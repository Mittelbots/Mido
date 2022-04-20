const { MessageActionRow } = require("discord.js");
const { addOptionButtons } = require("../addButtonsToList");

module.exports = async ({main_interaction}) => {
    const optionsButtons = await addOptionButtons({main_interaction});
    main_interaction.message.edit({
        components: [new MessageActionRow({
            components: [...optionsButtons]
        })]
    });
}