const { MessageActionRow } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("../getData/getLang");
const { refreshCategories_ToDo } = require("../getData/refreshCategories_ToDo");
const { addSelectMenu } = require("../toDoList/addSelectMenu");

module.exports.addProject = async (main_interaction, toDoCountInteraction) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`);

    var giveNameMessage = await main_interaction.message.channel.send('Bitte gebe einen Namen ein!');

    var messageCollector = await main_interaction.message.channel.createMessageCollector({
        filter: (() => main_interaction.message.author.id),
        time: 15000,
        max: 1
    });
    messageCollector.on('collect', async reply => {
        if(reply.content.toLowerCase() === 'cancel') {
            await reply.reply({
                content: `${lang.errors.canceled}!`
            }).then(async msg => {
                await delay(1500);
                msg.delete();
                toDoCountInteraction = 0;
                reply.delete();
                giveNameMessage.delete();
                giveNameMessage = null;
            });
            return; 
        }
        return await database.query('INSERT INTO hn_projects (name, color, guild_id) VALUES (?, ?, ?)', [reply.content, '#021982', reply.guildId])
            .then(async () => {
                const refresh = await refreshCategories_ToDo(main_interaction);
                categories = refresh[0];

                var newMessageEmbed = new MessageEmbed()
                .setTitle(lang.projects.choose_new_project)
                .setTimestamp()

                const newSelectMenu = await addSelectMenu(categories, null, main_interaction.message.guild.id)

                main_interaction.message.edit({
                    embeds: [newMessageEmbed],
                    components: [new MessageActionRow({
                        components: [newSelectMenu]
                    })]
                });

                return await reply.reply({
                    content: `${lang.success.saved}!`,
                }).then(async msg => {
                    await delay(2000);
                    messageCollector = null;
                    reply.delete();
                    msg.delete();
                    giveNameMessage.delete();
                })
            })
            .catch(err => {
                return errorhandler(err, lang.projects.errors.failed_add, main_interaction.message.channel);
            });
    });

    messageCollector.on('end', (collected, reason) => {
        if(reason === 'time') {
            try {
                giveNameMessage.edit({
                    content: `**${lang.errors.time_limit_reached} (15s)**`, 
                    components: [giveNameMessage.components[0]]
                });
            }catch(err) {
                return errorhandler(err);
            }
        }else {
            giveNameMessage.edit({
                content: `**${lang.errors.int_unexpected_end} ${reason}**`
            });
        }
    })
}