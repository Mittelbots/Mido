const {
    add_ProjectId,
    select_ProjectId,
    delete_Project,
    changeCurrentProjectId
} = require("../../variables/variables");
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
const { buttonInteraction } = require('./buttonInteraction/buttonInteraction');


module.exports.ProjectInteraction = async (main_interaction) => {
    //!CONST
    const refresh = await refreshProject_ToDo(main_interaction);

    //!VARIABLES
    var projects = refresh[0];
    var todo = refresh[1];

    if (main_interaction.isSelectMenu() && main_interaction.customId === select_ProjectId) {

        if (main_interaction.values.indexOf(add_ProjectId) !== -1) { //? Menu zum hinzufügen der Projekte

            return await addProject(main_interaction);

        } else if (main_interaction.values.indexOf(delete_Project) !== -1) { //? Menu zum löschen der Projekte

            return await deleteProject(main_interaction, projects, false);

        } else {
            //? ------WENN KATEGORIEN EXISTIEREN - Liste alle Projekte auf-----
            return await editToDoList(projects, todo, main_interaction, true);
        }
    } else if (main_interaction.isSelectMenu() && main_interaction.customId === delete_Project) {
        //!RUNS WHEN DELETE PROJECT IS SELECTED
        await deleteProject(main_interaction, projects, true)

    } else if (main_interaction.isButton()) {
        const buttonParams = {
            main_interaction,
            projects,
            todo,
        }
        buttonInteraction(buttonParams);
    }
}