const { MessageActionRow } = require("discord.js");
const { increase_toDoInteractionCount, decrease_toDoInteractionCount, getCurrentInteractionCount } = require("../../../variables/variables");
const { getProject } = require("../../getData/getProject");
const { addSelectMenu } = require("../addSelectMenu");

module.exports = async ({main_interaction}) => {
    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    const projects = await getProject(main_interaction.message.channel);
    var newSelectMenu = await addSelectMenu(projects, false, main_interaction.message.guild.id)
    await main_interaction.message.edit({
        components: [new MessageActionRow({
            components: [newSelectMenu]
        })]
    });

    decrease_toDoInteractionCount(main_interaction.user.id);
    newSelectMenu = null;
}