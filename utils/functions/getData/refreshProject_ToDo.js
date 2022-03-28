const { getProject } = require("./getProject");
const { getToDo } = require("./getToDo");

module.exports.refreshProject_ToDo = async (main_interaction) => {
    let categories = await getProject(main_interaction.message.channel);
    let todo = await getToDo(main_interaction.message.channel);

    return [categories, todo];
}