const { ActionRowBuilder } = require('discord.js');
const {
    increase_toDoInteractionCount,
    decrease_toDoInteractionCount,
    getCurrentInteractionCount,
} = require('../../../variables/variables');
const { addSelectMenu } = require('../addSelectMenu');
const Project = require('../../../class/Projects/Project');

module.exports = async ({ main_interaction }) => {
    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    const projects = await new Project().get(main_interaction.guild.id);
    const newSelectMenu = await addSelectMenu(
        main_interaction,
        projects,
        false,
        main_interaction.message.guild.id
    );
    await main_interaction.message.edit({
        components: [
            new ActionRowBuilder({
                components: [newSelectMenu],
            }),
        ],
    });

    decrease_toDoInteractionCount(main_interaction.user.id);
    newSelectMenu = null;
};
