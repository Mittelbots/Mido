const { MessageEmbed } = require("discord.js");
const { select_catId } = require("../../../src/commands/todo/todo");

module.exports.viewToDoList = async (categories, todo, main_interaction) => {
    var currentCatId;
    var newMessageEmbed;
    
    categories.map(async cat => {
        if (main_interaction.values.indexOf(select_catId + cat.id) !== -1) {

            newMessageEmbed = new MessageEmbed()
            newMessageEmbed.setTitle(`ToDo Liste - ${cat.name}`)
            newMessageEmbed.setColor(cat.color)

            if(todo) {
                todo.map(todo => {
                    if (todo.cat_id === cat.id) {
                        newMessageEmbed.addField('‎\n⏹️ ' + todo.title, '- _' + todo.text + '_ \n ||ID:' + todo.id + '||');
                    }
                });
            }

            currentCatId = cat.id
        }
    });

    return [currentCatId, newMessageEmbed];
}