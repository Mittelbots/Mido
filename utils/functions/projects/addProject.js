const { MessageActionRow } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getLang } = require("../getData/getLang");
const { refreshProject_ToDo } = require("../getData/refreshProject_ToDo");
const { addSelectMenu } = require("../toDoList/addSelectMenu");
const randomColor = require('randomcolor');
const config = require('../../assets/json/_config/config.json');
const { decrease_toDoInteractionCount } = require("../../variables/variables");
const { createLog } = require("../log/mido_log");
const { hasPermissions } = require("../hasPermissions/hasPermissions");

module.exports.addProject = async (main_interaction) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`);

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            add_projects: 1,
        }
    });

    if(!hasPerms) {
        return main_interaction.message.reply(lang.errors.noperms)
            .then(async msg => {
                await delay(2000);
                await msg.delete().catch(err => {})
            }).catch(err => {})
    }

    var giveNameMessage = await main_interaction.message.channel.send('Bitte gebe einen Namen ein!').catch(err => {});

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
                msg.delete().catch(err => {})
                decrease_toDoInteractionCount(main_interaction.user.id);
                reply.delete().catch(err => {})
                giveNameMessage.delete().catch(err => {})
                giveNameMessage = null;
            });
            return; 
        }
        return await database.query(`INSERT INTO ${config.tables.mido_projects} (name, color, guild_id) VALUES (?, ?, ?)`, [reply.content, randomColor(), reply.guildId])
            .then(async () => {
                errorhandler({err: '', message: `Project added UserID ${main_interaction.user.id} | GuildID: ${main_interaction.guild.id}`, fatal: false});
                createLog({
                    type: 4,
                    data: {
                        name: reply.content,
                    },
                    user: main_interaction.user,
                    guild: main_interaction.guild
                })

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
                    reply.delete().catch(err => {}).catch(err => null)
                    msg.delete().catch(err => {}).catch(err => null)
                    giveNameMessage.delete().catch(err => {}).catch(err => null)
                })
            })
            .catch(err => {
                return errorhandler({err, message: lang.projects.errors.failed_add, channel: main_interaction.message.channel, fatal: true});
            });
    });

    messageCollector.on('end', async (collected, reason) => {
        giveNameMessage.delete().catch(err => {}).catch(err => null)
        if(reason === 'time') {
            try {
                main_interaction.message.edit({
                    components: [main_interaction.message.components[0]]
                });
                
                main_interaction.message.channel.send({
                    content: `**${lang.errors.time_limit_reached}**`
                }).then(async msg => {
                    await delay(3000);
                    msg.delete().catch(err => {})
                });


            }catch(err) {
                return errorhandler({err, fatal: false});
            }
        }else {

            main_interaction.message.edit({
                components: [main_interaction.message.components[0]]
            });

            if(reason !== 'limit') {
                main_interaction.message.channel.send({
                    content: `**${lang.errors.int_unexpected_end} ${reason}**`
                }).then(async msg => {
                    await delay(3000);
                    msg.delete().catch(err => {})
                });
            }
        }
    })
}