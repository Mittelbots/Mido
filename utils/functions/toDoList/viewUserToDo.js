const { MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getCategory } = require("../getData/getCategory");
const { getLang } = require("../getData/getLang");

module.exports.viewUserToDo = async (user_id, guild_id, channel) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    return await database.query('SELECT * FROM mido_todo WHERE user_id = ?', [user_id])
        .then(async res => {
            if(res.length <= 0) {
                return false;
            }else {
                const categories = await getCategory(channel);

                const newEmbed = new MessageEmbed();
                newEmbed.setDescription(`${lang.todo.all_open_task_from} <@${user_id}>`)
                
                res.map(todo => {
                    categories.map(cat => {
                        if(todo.cat_id === cat.id) {
                            newEmbed.addField(`${lang.projects.project}: ${cat.name}\n⏹️ ${todo.title} ||ID: ${todo.id}||`, `_ ${todo.text}_ \n**${lang.todo.deadline}:** ${todo.deadline || lang.todo.no_deadline} \n**${lang.todo.other_user}:** ${todo.other_user || lang.todo.no_other_user}`)
                        }
                    });
                });

                return newEmbed;
            }
        })
        .catch(err => {
            errorhandler(err, lang.errors.general, channel);
            return false;
        })
}