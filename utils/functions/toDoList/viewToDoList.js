const { MessageEmbed } = require("discord.js");
const { select_ProjectId, toDoState_Inactive, toDoState_Ready } = require("../../variables/variables");
const { getLang } = require('../getData/getLang');

module.exports.viewToDoList = async (categories, todo, main_interaction, start) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)
    var currentCatId;
    var newMessageEmbed;
    //var count = 0;
    
    await categories.map(async cat => {
        if (main_interaction.values.indexOf(select_ProjectId + cat.id) !== -1) {
            newMessageEmbed = new MessageEmbed()
            newMessageEmbed.setTitle(`${lang.todo.todo_list} - ${cat.name}`)
            newMessageEmbed.setColor(cat.color)
            if(todo) {
                await todo.map((todo, index) => {
                    //if(index >= start && count <= start + 10) {
                        if (todo.cat_id === cat.id) {
                            let emoji = (todo.state === toDoState_Inactive) ? '🛑' : (todo.state === toDoState_Ready) ? '✅' : '⏹️';
                            newMessageEmbed.addField(`‎\n${emoji} ${todo.title} ||ID: ${todo.id}||`, `_ ${todo.text}_ \n\n**${lang.todo.deadline}:** ${todo.deadline || lang.todo.no_deadline} \n**${lang.todo.other_user}:** ${todo.other_user || lang.todo.no_other_user}`);
                            //count++;
                        }
                    //}else return;
                });
                //console.log(newMessageEmbed)
                //if(newMessageEmbed.embed.length === 0) newMessageEmbed = false;
            }
            currentCatId = cat.id
        }
    });
   
    return [currentCatId, newMessageEmbed];
}