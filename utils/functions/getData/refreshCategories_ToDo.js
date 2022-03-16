const { getCategory } = require("./getCategory");
const { getToDo } = require("./getToDo");

module.exports.refreshCategories_ToDo = async (main_interaction) => {
    let categories = await getCategory(main_interaction.message.channel);
    let todo = await getToDo(main_interaction.message.channel);

    return [categories, todo];
}