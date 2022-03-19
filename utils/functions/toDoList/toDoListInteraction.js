const {
    MessageActionRow
} = require("discord.js");
const {
    add_ProjectId,
    select_ProjectId,
    delete_Project
} = require("../../variables/variables");
const { getLang } = require("../getData/getLang");
const {
    refreshCategories_ToDo
} = require("../getData/refreshCategories_ToDo");
const {
    addProject
} = require("../projects/addProject");
const {
    deleteProject
} = require("../projects/deleteProject");
const {
    addButtons
} = require("./addButtonsToList");
const {
    newToDoInteraction
} = require("./newToDo");
const {
    viewToDoList
} = require("./viewToDoList");

var count = 0;
var categories;
var todo;

module.exports.todoListInteraction = async (main_interaction) => {
    const guildid = main_interaction.message.guild.id;

    const lang = require(`../../assets/json/language/${await getLang(guildid)}.json`)

    const refresh = await refreshCategories_ToDo(main_interaction);
    categories = refresh[0];
    todo = refresh[1];

    if (main_interaction.isSelectMenu() && main_interaction.customId === select_ProjectId) {

        if (main_interaction.values.indexOf(add_ProjectId) !== -1) { //? WENN KEINE KATEGORIE EXISTIERT

            return await addProject(main_interaction, count);

        } else if (main_interaction.values.indexOf(delete_Project) !== -1) {

            return await deleteProject(main_interaction, categories, false);

        } else {
            //? ------WENN KATEGORIEN EXISTIEREN-----

            const currentToDoList = await viewToDoList(categories, todo, main_interaction)

            var currentCatId = currentToDoList[0];
            const buttons = await addButtons(guildid);
            
            const todolist = await main_interaction.message.edit({
                embeds: [currentToDoList[1]],
                components: [new MessageActionRow({
                    components: [buttons[0], buttons[1], buttons[2], buttons[3]]
                })]
            });

            const collector = await todolist.createMessageComponentCollector({
                filter: ((user) => user.user.id === main_interaction.user.id)
            });

            collector.on('collect', async todo_item_interaction => {
                await newToDoInteraction(todo_item_interaction, main_interaction, count, currentCatId, categories, todolist, guildid)
            });

            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    var comp = todolist.components[0].components
                    for (let i in comp) {
                        comp[i].setDisabled(true)
                    }
                    todolist.edit({
                        content: `**${lang.errors.time_limit_reached} (60s)**`,
                        components: [todolist.components[0]]
                    })
                }
            });

            return;
        }
    } else if (main_interaction.isSelectMenu() && main_interaction.customId === delete_Project) {

        await deleteProject(main_interaction, categories, true)

    } else {

    }
}