const Project = require('../../class/Projects/Project');
const { getToDo } = require('./getToDo');

module.exports.refreshProject_ToDo = async (main_interaction) => {
    const categories = await new Project().get(main_interaction.guild.id);
    const todo = await getToDo(main_interaction.message.channel);

    return [categories, todo];
};
