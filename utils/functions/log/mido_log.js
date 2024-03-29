const { EmbedBuilder } = require('discord.js');
const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('../../../utils/functions/getData/getLang');

/**
 * 
 * @param {int} type
    * @type {0} todo item created
    * @type {1} todo item updated
    * @type {2} todo item deleted
    * @type {3} todo item completed
    * @type {4} project created
    * @type {5} project delted

 * @param {string} message
 * @param {object} data
 * @param {object} user
 */
module.exports.createLog = async ({ type, data, user, guild }) => {
    const lang = require(`../../assets/json/language/${await getLang(guild.id)}.json`);

    var log_channel = await getLogFromGuild(guild.id);

    if (!log_channel) return false;

    try {
        log_channel = guild.channels.cache.get(log_channel);
    } catch (err) {
        return false;
    }
    var log_embed = new EmbedBuilder();

    var titleemote;
    var isToDo = true;

    switch (type) {
        case 0:
            type = lang.logs.x_todo_create;
            titleemote = config.buttons.add_toDo.emoji;
            break;
        case 1:
            type = lang.logs.x_todo_updated;
            titleemote = config.buttons.edit_toDo.emoji;
            break;
        case 2:
            type = lang.logs.x_todo_deleted;
            titleemote = config.buttons.delete_toDo.emoji;
            break;
        case 3:
            type = lang.logs.x_todo_completed;
            titleemote = config.buttons.set_todo_ready.emoji;
            break;
        case 4:
            type = lang.logs.x_project_create;
            titleemote = config.buttons.change_prod.emoji;
            isToDo = false;

            log_embed.addFields([{ name: lang.logs.project_name, value: data.name }]);

            break;
        case 5:
            type = lang.logs.x_project_deleted;
            titleemote = config.buttons.delete_toDo.emoji;
            isToDo = false;

            log_embed.addFields([
                { name: lang.logs.project_name, value: data.name },
                { name: 'ID', value: data.id },
            ]);

            break;
    }
    if (isToDo) {
        log_embed.addFields([
            { name: lang.logs.todo_name, value: data.title },
            { name: lang.logs.todo_content, value: data.text || 'No Text provided' },
            { name: lang.todo.deadline, value: data.deadline || 'No Deadline provided' },
            { name: lang.todo.reminder, value: data.reminder || 'No Reminder provided' },
            { name: lang.todo.other_user, value: data.other_user || 'No other user provided' },
        ]);

        if (type !== lang.logs.x_todo_create)
            log_embed.addFields([{ name: 'ID:', value: data.id.toString() }]);
    }

    log_embed.setTitle(titleemote + ' ' + user.username + type);

    log_channel.send({
        embeds: [log_embed],
    });
};

async function getLogFromGuild(guild_id) {
    return await database
        .query(`SELECT log_channel FROM ${config.tables.mido_config} WHERE guild_id = ?`, [
            guild_id,
        ])
        .then((res) => {
            if (res.length === 0) return false;
            else return res[0].log_channel;
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return false;
        });
}
