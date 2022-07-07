const {
    add_ProjectId,
    select_ProjectId,
    delete_Project,
    delete_ready_todo
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
const { del_ready_todo } = require('./delete_ready_todo/del_ready_todo'); 

module.exports.ProjectInteraction = async (main_interaction) => {
    //!CONST
    const refresh = await refreshProject_ToDo(main_interaction);

    //!VARIABLES
    var projects = refresh[0];
    var todo = refresh[1];
    if(main_interaction.isSelectMenu()) {
        let permissions = main_interaction.values[0].split('$')[1];
        
        if(!permissions) {
            permissions = main_interaction.customId.split('$')[1];
        }

        try {
            let regex = /_[0-9]+/i;
            permissions = permissions.replace(permissions.match(regex)[0], '')
        }catch(err) {}
        
        if(permissions !== main_interaction.user.id) return;
    }

    if (main_interaction.isSelectMenu() && main_interaction.customId === select_ProjectId) {
        if (main_interaction.values[0].split(' ')[0].indexOf(add_ProjectId) !== -1) { //? Menu zum hinzufügen der Projekte
                return await addProject(main_interaction);

        } else if (main_interaction.values[0].split(' ')[0].indexOf(delete_Project) !== -1) { //? Menu zum löschen der Projekte
            return await deleteProject(main_interaction, projects, false);

        }else {
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
     else if(main_interaction.isSelectMenu() && main_interaction.customId.split(' ')[0] === delete_ready_todo) {
            return await del_ready_todo(main_interaction)

    }
}