const { EmbedBuilder } = require("discord.js");
const { select_ProjectId, toDoState_Inactive, toDoState_Ready, getCurrentSiteCount, changeCurrentProjectId } = require("../../variables/variables");
const { getLang } = require('../getData/getLang');
const config = require('../../assets/json/_config/config.json');

module.exports.viewToDoList = async (projects, todo, main_interaction) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)
    var newEmbedBuilder;
    let start = getCurrentSiteCount() ?? 0;
    let count = 0;

    let pass = false;

    await projects.map(async cat => {
        let isInProject;
        try {
            isInProject = main_interaction.values[0].split(' ')[0].indexOf(select_ProjectId + cat.id);
        }catch(err) {
            isInProject = main_interaction.customId.search(cat.id) ?? main_interaction.customId.search(config.buttons.add_ToDo.customId);
        } 
        if (isInProject !== -1) {
            newEmbedBuilder = new EmbedBuilder()
            newEmbedBuilder.setTitle(`${lang.todo.todo_list} - ${cat.name}`)
            newEmbedBuilder.setColor(cat.color)
            if(todo) {
                await todo.map((todo, index) => {
                    if(index >= start && count <= start + 10) {
                        if (todo.cat_id === cat.id) {
                            newEmbedBuilder.setColor(cat.color);
                            let emoji = (todo.state === toDoState_Inactive) ? '🛑' : (todo.state === toDoState_Ready) ? '✅' : '⏹️';
                            newEmbedBuilder.addFields([{name: `‎\n${emoji} ${todo.title} ||ID: ${todo.id}||`, value: `_ ${todo.text || lang.todo.no_text}_ \n\n**${lang.todo.deadline}:** ${todo.deadline || lang.todo.no_deadline} \n**${lang.todo.other_user}:** ${todo.other_user || lang.todo.no_other_user} \n**-----------------**`}]);
                            count++;
                            pass = true;
                        }
                    }else return;
                });
                if (newEmbedBuilder.data.length === 0 && start === 0) {
                    newEmbedBuilder = new EmbedBuilder()
                    newEmbedBuilder.setTitle(`${lang.todo.todo_list} - ${cat.name}`)
                    newEmbedBuilder.setColor(cat.color)
                    pass = true;
                }
            }else {
                pass = true;
            }
            changeCurrentProjectId(cat.id, main_interaction.user.id);
        }
    });
    if(!pass) return pass;

    return newEmbedBuilder;
}