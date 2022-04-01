const { MessageActionRow } = require("discord.js");
const { getCurrentSiteCount, decrease_currentSiteCount } = require("../../../variables/variables");
const { addButtons, addOptionButtons } = require("../addButtonsToList");
const { viewToDoList } = require("../viewToDoList");

module.exports.editToDoList = async (projects, todo, main_interaction, isMain) => {
    let currentSiteCount = getCurrentSiteCount();
    const currentToDoList = await viewToDoList(projects, todo, main_interaction, currentSiteCount)
    if(!currentToDoList) {
        return decrease_currentSiteCount();   
    }

    let currentCatId = currentToDoList[0];

    let buttons;
    if(isMain) {
        buttons = await addButtons(main_interaction.message.guild.id);
    }else {
        buttons = await addOptionButtons(main_interaction.message.guild.id, currentCatId);
    }

    let message = await main_interaction.message.edit({
        embeds: [currentToDoList[1]],
        components: [new MessageActionRow({
            components: [...buttons]
        })]
    }).catch(async () => {
        currentSiteCount = decrease_currentSiteCount();
    });

    return [currentCatId, message];
}