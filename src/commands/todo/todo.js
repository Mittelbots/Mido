const {
    MessageButton,
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu
} = require('discord.js');
const database = require('../../../bot/db/db');
const config = require('../../../utils/assets/json/_config/config.json');
const { delay } = require('../../../utils/functions/delay/delay');

const {
    errorhandler
} = require('../../../utils/functions/errorhandler/errorhandler');
const {
    getCategory
} = require('../../../utils/functions/getData/getCategory');
const {
    getToDo
} = require('../../../utils/functions/getData/getToDo');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const { 
    removeMention 
} = require('../../../utils/functions/removeCharacters/removeCharacters');
const {
    addButtons
} = require('../../../utils/functions/toDoList/addButtonsToList');
const {
    addSelectMenu
} = require('../../../utils/functions/toDoList/addSelecMenu');
const {
    newToDoEmbed,
    newToDoButtons
} = require('../../../utils/functions/toDoList/newToDo');


var sent = false;
var count = 0;

module.exports.run = async (bot, message, args) => {
    if (!await hasPermissions(message.member)) {
        return message.reply('Du hast keine Berechtigung dafür.');
    }

    var todo = await getToDo(message.channel);
    var categories = await getCategory(message.channel);

    if (!todo) return message.channel.send('Keine To-Do Liste in der Datenbank.');

    if (sent) {
        return message.reply({
            content: 'Du hast noch eine Sitzung offen!'
        }).then(msg => {
            setTimeout(() => {
                return msg.delete();
            }, 6000);
        })
    }

    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? 'Wähle eine neue Kategorie aus.' : 'Füge zuerst eine neue Kategorie hinzu.')
        .setTimestamp()

    const add_catId = 'add_cat';
    const select_catId = 'select_cat';

    var newMessageEmbedInteraction = new MessageActionRow()
        .addComponents(addSelectMenu(categories, select_catId, add_catId))

    message.reply({
        embeds: [newMessageEmbed],
        components: [newMessageEmbedInteraction]
    });

    bot.on('interactionCreate', async (main_interaction) => {
        await main_interaction.deferUpdate();
        sent = true;

        if (main_interaction.isSelectMenu() && main_interaction.customId === 'select_cat') {
            //? WENN KEINE KATEGORIE EXISTIERT
            if (main_interaction.values.indexOf(add_catId) !== -1) {
                await message.channel.send('Bitte gebe einen Namen ein!')
                var messageCollector = await message.channel.createMessageCollector({
                    filter: (() => message.author.id),
                    time: 15000,
                    max: 1
                });

                messageCollector.on('collect', async reply => {
                    return await database.query('INSERT INTO hn_category (name, color) VALUES (?, ?)', [reply.content, '#021982'])
                        .then(() => {
                            return reply.reply({
                                content: 'Saved',
                                ephemeral: true,
                                components: []
                            })
                        })
                        .catch(err => {
                            return errorhandler(err, 'Fehler beim hinzufügen.', message.channel);
                        });
                });

            } else {
                //? WENN KATEGORIEN EXISTIEREN
                var currentCatId;
                categories.map(async cat => {
                    if (main_interaction.values.indexOf(select_catId + cat.id) !== -1) {

                        newMessageEmbed = new MessageEmbed()
                        newMessageEmbed.setTitle(`ToDo Liste - ${cat.name}`)
                        newMessageEmbed.setColor(cat.color)

                        todo.map(todo => {
                            if (todo.cat_id === cat.id) {
                                newMessageEmbed.addField('‎\n⏹️ ' + todo.title, '- _' + todo.text + '_ \n ||ID:' + todo.id + '||');
                            }
                        });

                        currentCatId = cat.id;
                    }
                });

                const todolist = await main_interaction.message.edit({
                    embeds: [newMessageEmbed],
                    components: [new MessageActionRow({
                        components: [addButtons()[0], addButtons()[1], addButtons()[2]]
                    })]
                })

                const collector = await todolist.createMessageComponentCollector({
                    filter: (() => message.author.id),
                    time: 60000
                });

                collector.on('collect', async todo_item_interaction => {
                    var title = '';
                    var text = '';
                    var deadline = '';
                    var dateFormatDC = '';
                    var user = '';

                    switch (todo_item_interaction.customId) {
                        case 'add_toDo':

                            count++;
                            if (count > 1) {
                                return;
                            }

                            const task = await todo_item_interaction.channel.send({
                                embeds: [newToDoEmbed()],
                                components: [new MessageActionRow({
                                    components: [newToDoButtons()[0], newToDoButtons()[1], newToDoButtons()[2], newToDoButtons()[3], newToDoButtons()[4]]
                                })]
                            });

                            const newToDocollector = await task.createMessageComponentCollector({
                                filter: (() => message.author.id),
                                time: 120000
                            });

                            var interactionCount = 0;
                            await newToDocollector.on('collect', async todo_interaction => {
                                var todo_interaction_reply;

                                interactionCount++;
                                if (interactionCount > 1) {
                                    return;
                                }
                                switch (todo_interaction.customId) {
                                    case 'add_title':
                                        todo_interaction_reply = await todo_interaction.message.reply({
                                            content: 'Bitte sende den Titel in den Channel.',
                                            ephemeral: true
                                        });
                                        break;

                                    case 'add_text':
                                        todo_interaction_reply = await todo_interaction.message.reply({
                                            content: 'Bitte sende den Text in den Channel.',
                                            ephemeral: true
                                        });
                                        break;

                                    case 'add_deadline':
                                        todo_interaction_reply = await todo_interaction.message.reply({
                                            content: 'Bitte sende eine DeadLine in den Channel. [DD.MM.JJJJ]',
                                            ephemeral: true
                                        });
                                        break;

                                    case 'add_other':
                                        todo_interaction_reply = await todo_interaction.message.reply({
                                            content: 'Bitte sende andere Nutzer in den Channel, indem Du diese Taggst [@Mittelblut9].',
                                            ephemeral: true
                                        });
                                        break;

                                    case 'save':
                                        var canPass = true;

                                        if(title == '') {
                                            canPass = false;
                                            todo_interaction.channel.send('Der Titel fehlt!').then(async msg => {
                                                await delay(10000);
                                                msg.delete();
                                            })
                                        }

                                        if(text == '' && canPass) {
                                            canPass = false;
                                            todo_interaction.channel.send('Der Text fehlt!').then(async msg => {
                                                await delay(10000);
                                                msg.delete();
                                            })
                                        }

                                        if(canPass) {
                                            await database.query('INSERT INTO hn_todo (user_id, title, text, deadline, other_user, cat_id) VALUES (?, ?, ?, ?, ?, ?)', [message.author.id, title, text, deadline, user, currentCatId])
                                                .then(() => {
                                                    todo_interaction.channel.send('Die neue Task wurde erfolgreich gespeichert!').then(async msg => {
                                                        await delay(10000);
                                                        msg.delete();
                                                    })
                                                })
                                                .catch(err => {
                                                    console.log(err);
                                                    todo_interaction.channel.send('Irgendetwas ist falsch gelaufen!').then(async msg => {
                                                        await delay(10000);
                                                        msg.delete();
                                                    })
                                                })

                                                await delay(10000);
                                                task.delete();
                                                count--;
                                        }
                                        break;

                                    case 'next':
                                        var old_todo_interaction = todo_interaction;
                                        todo_interaction = null;

                                        await old_todo_interaction.message.edit({
                                            components: [new MessageActionRow({
                                                components: [newToDoButtons(true)[0], newToDoButtons(true)[1], newToDoButtons(true)[2]]
                                            })]
                                        });
                                        interactionCount--;
                                        break;
                                }

                                var messageCollector = await message.channel.createMessageCollector({
                                    filter: (() => message.author.id),
                                    time: 60000,
                                    max: 1
                                });

                                messageCollector.on('collect', async reply => {
                                    switch (todo_interaction.customId) {
                                        case 'add_title':
                                            title = reply.content;
                                            task.edit({
                                                embeds: [newToDoEmbed(title, text, deadline, user)]
                                            });
                                            interactionCount--;
                                            break;

                                        case 'add_text':
                                            text = reply.content;
                                            task.edit({
                                                embeds: [newToDoEmbed(title, text, deadline, user)]
                                            });
                                            interactionCount--;
                                            break;

                                        case 'add_deadline':
                                            deadline = reply.content;
                                            deadline = deadline.split('.');

                                            let day = deadline[0]
                                            let month = deadline[1]
                                            let year = deadline[2];

                                            if(year === undefined) {
                                                year = new Date().getFullYear().toString();
                                            }
                                            var date = new Date(JSON.stringify(`${year}-${month}-${day}`))
                                            await delay(1000);
                                            if(JSON.stringify(date) != 'null') {
                                                deadline = `${day}.${month}.${year}`;
                                                dateFormatDC = ` <t:${Math.floor(date/1000)}:R>`
                                                task.edit({
                                                    embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                                                });
                                            }else {
                                                reply.channel.send({
                                                    content: 'Du hast ein falsches Format übermittelt! DD.MM.YYYY oder DD.MM'
                                                }).then(async msg => {
                                                    await delay(10000);
                                                    msg.delete();
                                                })
                                            }
                                            interactionCount--;
                                            break;

                                        case 'add_other':
                                            let other_user = reply.content.split(' ');

                                            for(let i in other_user) {
                                                other_user[i] = removeMention(other_user[i]);

                                                try {
                                                    other_user[i] = message.guild.members.cache.find(member => member.id.includes(other_user[i])).user

                                                }catch(err) {
                                                    reply.channel.send({
                                                        content: `Der Spieler wurde nicht gefunden!`
                                                    }).then(async msg => {
                                                        await delay(10000);
                                                        msg.delete();
                                                    })
                                                    i = other_user.length;
                                                    continue;
                                                }

                                                user += `${other_user[i]} `;
                                            }
                                            task.edit({
                                                embeds: [newToDoEmbed(title, text, deadline + dateFormatDC, user)]
                                            });

                                            interactionCount--;
                                            break;

                                        default:
                                            break;
                                    }

                                    reply.delete();
                                    todo_interaction_reply.delete();
                                });
                            });
                        case 'change_cat':
                            var old_int = todo_item_interaction;
                            todo_item_interaction = null;
                            old_int.message.edit({
                                components: [new MessageActionRow({
                                    components: [addSelectMenu(categories, select_catId, add_catId)]
                                })]
                            })
                            break;

                        case 'delete_toDo':
                            await todo_item_interaction.channel.send({
                                content: 'Bitte gebe die ID ein, von der Task, die du löschen möchtest.',
                                ephemeral: true
                            });

                            var messageCollectorDeleteToDo = await message.channel.createMessageCollector({
                                filter: (() => message.author.id),
                                time: 15000,
                                max: 1
                            });

                            messageCollectorDeleteToDo.on('collect', async reply => {
                                if(isNaN(reply.content)) {
                                    return reply.reply({
                                        content: 'Es sind nur Nummern erlaubt! Versuche es erneut.'
                                    }).then(async msg => {
                                        await delay(50000);
                                        reply.delete();
                                        msg.delete();
                                    })
                                }else {
                                    const task = await database.query('SELECT id FROM hn_todo WHERE id = ?', [reply.content])
                                        .then(res => {return res[0]})
                                        .catch(err => console.log(err));

                                    if(task) {
                                        return await database.query('DELETE FROM hn_todo WHERE id = ?', [reply.content])
                                            .then(async () => {
                                                return reply.reply({
                                                    content: 'Erfolgreich gelöscht!'
                                                }).then(async msg => {
                                                    await delay(50000);
                                                    reply.delete();
                                                    msg.delete();
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                return reply.reply({
                                                    content: 'Etwas ist schief gelaufen!'
                                                }).then(async msg => {
                                                    await delay(50000);
                                                    reply.delete();
                                                    msg.delete();
                                                })
                                            })
                                    }else {
                                        return reply.reply({
                                            content: 'Es wurde keine ToDo Task mit der ID gefunden!'
                                        }).then(async msg => {
                                            await delay(50000);
                                            reply.delete();
                                            msg.delete();
                                        })
                                    }
                                }
                            });
                            break;
                    }
                });

                collector.on('end', () => {
                    send = false;
                });

                return;
            }
        }
    });
}

module.exports.help = {
    name: "todo",
    description: "",
    usage: "todo"
}