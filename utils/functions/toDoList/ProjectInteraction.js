const {
    add_ProjectId,
    select_ProjectId,
    delete_Project,
    getCurrentSiteCount
} = require("../../variables/variables");
const { getLang } = require("../getData/getLang");
const {
    refreshProject_ToDo
} = require("../getData/refreshProject_ToDo");
const {
    addProject
} = require("../projects/addProject");
const {
    deleteProject
} = require("../projects/deleteProject");
const { editToDoList } = require("./editToDoList/editToDoList");
const {
    toDoListOverview
} = require("./toDoListOverview");
const { buttonInteraction } = require('./buttonInteraction/buttonInteraction');


module.exports.ProjectInteraction = async (main_interaction, params) => {
    //!CONST
    const guildid = main_interaction.message.guild.id;
    const lang = require(`../../assets/json/language/${await getLang(guildid)}.json`);
    const refresh = await refreshProject_ToDo(main_interaction);

    //!VARIABLES
    var currentSiteCount = getCurrentSiteCount();
    var toDoCountInteraction = params.toDoCountInteraction;
    var todoListInteractionCount = params.todoListInteractionCount;
    
    var projects = refresh[0];
    var todo = refresh[1];

    if (main_interaction.isSelectMenu() && main_interaction.customId === select_ProjectId) {

        if (main_interaction.values.indexOf(add_ProjectId) !== -1) { //? Menu zum hinzufügen der Projekte

            return await addProject(main_interaction, toDoCountInteraction);

        } else if (main_interaction.values.indexOf(delete_Project) !== -1) { //? Menu zum löschen der Projekte

            return await deleteProject(main_interaction, projects, false);

        } else {
            //? ------WENN KATEGORIEN EXISTIEREN - Liste alle Projekte auf-----
            
            var todolist = await editToDoList(projects, todo, main_interaction, true);
            var currentCatId = todolist[0];
            todolist = todolist[1];

            const collector = await todolist.createMessageComponentCollector({
                filter: ((user) => user.user.id === main_interaction.user.id)
            });

            collector.on('collect', async todo_item_interaction => {
                todoListInteractionCount++;
                if (todoListInteractionCount > 1) {
                    return;
                }else {
                    await toDoListOverview(todo_item_interaction, main_interaction, toDoCountInteraction, currentCatId, projects, todolist, guildid)
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
        //!RUNS WHEN DELETE PROJECT IS SELECTED
        await deleteProject(main_interaction, projects, true)

    } else if (main_interaction.isButton()) {
        const buttonParams = {
            main_interaction,
            projects,
            todo,
            currentCatId,
            toDoCountInteraction
        }
        buttonInteraction(buttonParams);
    }
}