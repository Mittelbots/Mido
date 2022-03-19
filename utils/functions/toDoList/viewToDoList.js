const { MessageEmbed } = require("discord.js");
const { select_ProjectId } = require("../../variables/variables");

module.exports.viewToDoList = async (categories, todo, main_interaction) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)
    var currentCatId;
    var newMessageEmbed;
    
    categories.map(async cat => {
        if (main_interaction.values.indexOf(select_ProjectId + cat.id) !== -1) {
            newMessageEmbed = new MessageEmbed()
            newMessageEmbed.setTitle(`${lang.todo.todo_list} - ${cat.name}`)
            newMessageEmbed.setColor(cat.color)
            if(todo) {
                todo.map(todo => {
                    if (todo.cat_id === cat.id) {
                        newMessageEmbed.addField(`‎\n⏹️ ${todo.title} ||ID: ${todo.id}||`, `_ ${todo.text}_ \n\n**${lang.todo.deadline}:** ${todo.deadline || lang.todo.no_deadline} \n**${lang.todo.other_user}:** ${todo.other_user || lang.todo.no_other_user}`);
                    }
                });
            }

            currentCatId = cat.id
        }
    });

    return [currentCatId, newMessageEmbed];
}