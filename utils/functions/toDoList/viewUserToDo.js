const { EmbedBuilder } = require('discord.js');
const database = require('../../../bot/db/db');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('../getData/getLang');
const config = require('../../assets/json/_config/config.json');
const Project = require('../../class/Projects/Project');

module.exports.viewUserToDo = async (user_id, guild_id, channel) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`);

    return await database
        .query(`SELECT * FROM ${config.tables.mido_todo} WHERE user_id = ?`, [user_id])
        .then(async (res) => {
            if (res.length <= 0) {
                return false;
            } else {
                const categories = await new Project().get(guild_id);

                const newEmbed = new EmbedBuilder();
                newEmbed.setDescription(`${lang.todo.all_open_task_from} <@${user_id}>`);

                res.map((todo) => {
                    categories.map((cat) => {
                        if (todo.cat_id === cat.id) {
                            newEmbed.addFields([
                                {
                                    name: `${lang.projects.project}: ${cat.name}\n⏹️ ${todo.title} ||ID: ${todo.id}||`,
                                    value: `_ ${todo.text || lang.todo.no_text}_ \n\n**${
                                        lang.todo.deadline
                                    }:** ${todo.deadline || lang.todo.no_deadline} \n**${
                                        lang.todo.other_user
                                    }:** ${
                                        todo.other_user || lang.todo.no_other_user
                                    } \n**-----------------**`,
                                },
                            ]);
                        }
                    });
                });

                return newEmbed;
            }
        })
        .catch((err) => {
            errorhandler({ err, mesage: lang.errors.general, channel, fatal: true });
            return false;
        });
};
