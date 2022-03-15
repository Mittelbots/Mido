const { MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getCategory } = require("../getData/getCategory");

module.exports.viewUserToDo = async (user_id, guild_id, channel) => {
    return await database.query('SELECT * FROM hn_todo WHERE user_id = ?', [user_id])
        .then(async res => {
            if(res.length <= 0) {
                return false;
            }else {
                const categories = await getCategory(channel);

                const newEmbed = new MessageEmbed();
                newEmbed.setDescription(`Alle offenen Task von <@${user_id}>`)
                
                res.map(todo => {
                    categories.map(cat => {
                        if(todo.cat_id === cat.id) {
                            newEmbed.addField(`Kategorie: ${cat.name}\n⏹️ ${todo.title} ||ID: ${todo.id}||`, `_ ${todo.text}_ \n\n**Deadline:** ${todo.deadline || 'Keine'} \n**Andere Nutzer:** ${todo.other_user ||'No one'}`)
                        }
                    });
                });

                return newEmbed;
            }
        })
        .catch(err => {
            errorhandler(err, 'Error due database request!', channel);
            return false;
        })
}