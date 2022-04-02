const { MessageActionRow } = require("discord.js");
const { getCurrentSiteCount, decrease_currentSiteCount, changeCurrentProjectId, getCurrentProjectId } = require("../../../variables/variables");
const { addButtons, addOptionButtons } = require("../addButtonsToList");
const { viewToDoList } = require("../viewToDoList");

module.exports.editToDoList = async (projects, todo, main_interaction, isMain) => {
    let currentSiteCount = getCurrentSiteCount();
    const currentToDoList = await viewToDoList(projects, todo, main_interaction);
    if(!currentToDoList) {
        return decrease_currentSiteCount();   
    }

    let buttons;
    if(isMain) {
        buttons = await addButtons(main_interaction.message.guild.id);
    }else {
        buttons = await addOptionButtons(main_interaction.message.guild.id);
    }
    let message = await main_interaction.message.edit({
        embeds: [currentToDoList],
        components: [new MessageActionRow({
            components: [...buttons]
        })]
    }).catch(async () => {
        currentSiteCount = decrease_currentSiteCount();
    });
    return [message];
}