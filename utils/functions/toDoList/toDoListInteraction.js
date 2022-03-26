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
    toDoListOverview
} = require("./toDoListOverview");
const {
    viewToDoList
} = require("./viewToDoList");

var toDoCountInteraction = 0;
var todoListInteractionCount = 0;

var categories;
var todo;

module.exports.todoListInteraction = async (main_interaction) => {
    const guildid = main_interaction.message.guild.id;

    const lang = require(`../../assets/json/language/${await getLang(guildid)}.json`)

    const refresh = await refreshCategories_ToDo(main_interaction);
    categories = refresh[0];
    todo = refresh[1];

    if (main_interaction.isSelectMenu() && main_interaction.customId === select_ProjectId) {

        if (main_interaction.values.indexOf(add_ProjectId) !== -1) { //? Menu zum hinzufügen der Projekte

            return await addProject(main_interaction, toDoCountInteraction);

        } else if (main_interaction.values.indexOf(delete_Project) !== -1) { //? Menu zum löschen der Projekte

            return await deleteProject(main_interaction, categories, false);

        } else {
            //? ------WENN KATEGORIEN EXISTIEREN - Liste alle Projekte auf-----
            var start = 0;
            var currentCatId;
            var todolist

            const buttons = await addButtons(guildid);
            
            async function editToDoList() {  
                const currentToDoList = await viewToDoList(categories, todo, main_interaction, start)

                currentCatId = currentToDoList[0];

                todolist = await main_interaction.message.edit({
                    embeds: [currentToDoList[1]],
                    components: [new MessageActionRow({
                        components: [buttons[0], buttons[1], buttons[2], buttons[3], buttons[4]]
                    })]
                }).catch(async () => {
                    start = Number(start) + 10;
                    await editToDoList();
                })
            }
            await editToDoList();

            const collector = await todolist.createMessageComponentCollector({
                filter: ((user) => user.user.id === main_interaction.user.id)
            });

            collector.on('collect', async todo_item_interaction => {
                todoListInteractionCount++;
                if (todoListInteractionCount > 1) {
                    return;
                }else {
                    await toDoListOverview(todo_item_interaction, main_interaction, toDoCountInteraction, currentCatId, categories, todolist, guildid)
                    todoListInteractionCount = 0;
                }
            });

            collector.on('end', (collected, reason) => {
                todolist.edit({
                    content: `**${lang.errors.int_unexpected_end} ${reason}**`,
                })
            });

            return;
        }
    } else if (main_interaction.isSelectMenu() && main_interaction.customId === delete_Project) {

        await deleteProject(main_interaction, categories, true)

    } else {

    }
}