const { MessageEmbed } = require("discord.js");
const { select_ProjectId, toDoState_Inactive, toDoState_Ready, getCurrentSiteCount, changeCurrentProjectId } = require("../../variables/variables");
const { getLang } = require('../getData/getLang');
const config = require('../../assets/json/_config/config.json');

module.exports.viewToDoList = async (projects, todo, main_interaction) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)
    var newMessageEmbed;
    let start = getCurrentSiteCount() ?? 0;
    let count = 0;

    let pass = false;
    
    await projects.map(async cat => {
        let isInProject;
        try {
            isInProject = main_interaction.values.indexOf(select_ProjectId + cat.id) 
        }catch(err) {
            isInProject = main_interaction.customId.search(cat.id) || main_interaction.customId.search(config.buttons.add_ToDo.customId);
        } 
        if (isInProject !== -1) {
            newMessageEmbed = new MessageEmbed()
            newMessageEmbed.setTitle(`${lang.todo.todo_list} - ${cat.name}`)
            newMessageEmbed.setColor(cat.color)
            if(todo) {
                await todo.map((todo, index) => {
                    if(index >= start && count <= start + 10) {
                        if (todo.cat_id === cat.id) {
                            newMessageEmbed.setColor(cat.color);
                            let emoji = (todo.state === toDoState_Inactive) ? '🛑' : (todo.state === toDoState_Ready) ? '✅' : '⏹️';
                            newMessageEmbed.addField(`‎\n${emoji} ${todo.title} ||ID: ${todo.id}||`, `_ ${todo.text || lang.todo.no_text}_ \n\n**${lang.todo.deadline}:** ${todo.deadline || lang.todo.no_deadline} \n**${lang.todo.other_user}:** ${todo.other_user || lang.todo.no_other_user} \n**-----------------**`);
                            count++;
                            pass = true;
                        }
                    }else return;
                });
                if (newMessageEmbed.fields.length === 0 && start === 0) {
                    newMessageEmbed = new MessageEmbed()
                    newMessageEmbed.setTitle(`${lang.todo.todo_list} - ${cat.name}`)
                    newMessageEmbed.setColor(cat.color)
                    pass = true;
                }
            }else {
                pass = true;
            }
            changeCurrentProjectId(cat.id);
        }
    });
    if(!pass) return pass;

    return newMessageEmbed;
}