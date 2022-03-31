const { MessageActionRow } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("../getData/getLang");
const { refreshProject_ToDo } = require("../getData/refreshProject_ToDo");
const { addSelectMenu } = require("../toDoList/addSelectMenu");
const randomColor = require('randomcolor');
const config = require('../../assets/json/_config/config.json');

module.exports.addProject = async (main_interaction, toDoCountInteraction) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`);

    var giveNameMessage = await main_interaction.message.channel.send('Bitte gebe einen Namen ein!');

    var messageCollector = await main_interaction.message.channel.createMessageCollector({
        filter: (() => main_interaction.message.author.id),
        time: 20000,
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
        return await database.query(`INSERT INTO ${config.tables.mido_projects} (name, color, guild_id) VALUES (?, ?, ?)`, [reply.content, randomColor(), reply.guildId])
            .then(async () => {
                const refresh = await refreshProject_ToDo(main_interaction);
                categories = refresh[0];

                const newSelectMenu = await addSelectMenu(categories, null, main_interaction.message.guild.id)

                main_interaction.message.edit({
                    components: [new MessageActionRow({
                        components: [newSelectMenu]
                    })]
                });

                return await reply.reply({
                    content: `${lang.success.saved}!`,
                }).then(async msg => {
                    await delay(2000);
                    messageCollector = null;
                    reply.delete().catch(err => null)
                    msg.delete().catch(err => null)
                    giveNameMessage.delete().catch(err => null)
                })
            })
            .catch(err => {
                return errorhandler(err, lang.projects.errors.failed_add, main_interaction.message.channel);
            });
    });

    messageCollector.on('end', async (collected, reason) => {
        giveNameMessage.delete().catch(err => null)
        if(reason === 'time') {
            try {
                main_interaction.message.edit({
                    components: [main_interaction.message.components[0]]
                });
                
                main_interaction.message.channel.send({
                    content: `**${lang.errors.time_limit_reached}**`
                }).then(async msg => {
                    await delay(3000);
                    msg.delete();
                });


            }catch(err) {
                return errorhandler(err);
            }
        }else {
            
            main_interaction.message.edit({
                components: [main_interaction.message.components[0]]
            });

            main_interaction.message.channel.send({
                content: `**${lang.errors.int_unexpected_end} ${reason}**`
            }).then(async msg => {
                await delay(3000);
                msg.delete();
            });
        }
    })
}