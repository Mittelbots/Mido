const { MessageEmbed, MessageActionRow } = require("discord.js");
const database = require("../../../bot/db/db");
const { add_catId, select_catId } = require("../../../src/commands/todo/todo");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { getCategory } = require("../getData/getCategory");
const { getToDo } = require("../getData/getToDo");
const { removeMention } = require("../removeCharacters/removeCharacters");
const { addButtons } = require("./addButtonsToList");
const { addSelectMenu } = require("./addSelecMenu");
const { newToDoEmbed, newToDoButtons } = require("./newToDo");
const { viewToDoList } = require("./viewToDoList");

var count = 0;

module.exports.todoListInteraction = async (main_interaction) => {

    var categories;
    var todo;

    async function refreshCategories_ToDo() {
        categories = await getCategory(main_interaction.message.channel);
        todo = await getToDo(main_interaction.message.channel);
    }
    await refreshCategories_ToDo();

    if (main_interaction.isSelectMenu() && main_interaction.customId === 'select_cat') {
        //? WENN KEINE KATEGORIE EXISTIERT
        if (main_interaction.values.indexOf(add_catId) !== -1) {
            var giveNameMessage = await main_interaction.message.channel.send('Bitte gebe einen Namen ein!');

            var messageCollector = await main_interaction.message.channel.createMessageCollector({
                filter: (() => main_interaction.message.author.id),
                time: 15000,
                max: 1
            });

            messageCollector.on('collect', async reply => {
                if(reply.content.toLowerCase() === 'cancel') {
                    await reply.reply({
                        content: 'Abgebrochen!'
                    }).then(async msg => {
                        await delay(2000);
                        msg.delete();
                    });
                    count = count - 1;
                    reply.delete();
                    giveNameMessage.delete();
                    giveNameMessage = null;
                    return; 
                }
                return await database.query('INSERT INTO hn_category (name, color) VALUES (?, ?)', [reply.content, '#021982'])
                    .then(async () => {
                        await refreshCategories_ToDo();

                        var newMessageEmbed = new MessageEmbed()
                        .setTitle('Wähle ein neues Projekt aus.')
                        .setTimestamp()

                        const newSelectMenu = await addSelectMenu(categories, select_catId, add_catId)

                        main_interaction.message.edit({
                            embeds: [newMessageEmbed],
                            components: [new MessageActionRow({
                                components: [newSelectMenu]
                            })]
                        })
                        messageCollector = null;
                        return reply.reply({
                            content: 'Saved',
                        }).then(async msg => {
                            await delay(3000);
                            reply.delete();
                            msg.delete();
                            giveNameMessage.delete();
                        })
                    })
                    .catch(err => {
                        return errorhandler(err, 'Fehler beim hinzufügen.', main_interaction.message.channel);
                    });
            });

            messageCollector.on('end', (collected, reason) => {
                if(reason === 'time') {
                    try {
                        var comp = giveNameMessage.components[0].components
                        for(let i in comp) {
                            comp[i].setDisabled(true)
                        }
                        giveNameMessage.edit({content: '**Time limit reached (15s)**', components: [giveNameMessage.components[0]]})
                    }catch(err) {
                        console.log(err);
                    }
                }
            })

        } else {
            //? ------WENN KATEGORIEN EXISTIEREN-----

            const currentToDoList = await viewToDoList(categories, todo, main_interaction)

            var currentCatId = currentToDoList[0];

            const todolist = await main_interaction.message.edit({
                embeds: [currentToDoList[1]],
                components: [new MessageActionRow({
                    components: [addButtons()[0], addButtons()[1], addButtons()[2], addButtons()[3]]
                })]
            })

            const collector = await todolist.createMessageComponentCollector({
                filter: (() => main_interaction.message.author.id)
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
                            filter: (() => main_interaction.message.author.id),
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
                                        todo_interaction.channel.send({
                                            content:'Der Titel fehlt!'
                                        }).then(async msg => {
                                            await delay(3000);
                                            msg.delete();
                                        })
                                    }

                                    if(text == '' && canPass) {
                                        canPass = false;
                                        todo_interaction.channel.send({
                                            content: 'Der Text fehlt!'
                                        }).then(async msg => {
                                            await delay(3000);
                                            msg.delete();
                                        })
                                    }

                                    if(canPass) {
                                        await database.query('INSERT INTO hn_todo (user_id, title, text, deadline, other_user, cat_id) VALUES (?, ?, ?, ?, ?, ?)', [main_interaction.message.author.id, title, text, deadline, user, currentCatId])
                                            .then(() => {
                                                todo_interaction.channel.send({
                                                    content: 'Die neue Task wurde erfolgreich gespeichert!'
                                                }).then(async msg => {
                                                    await delay(3000);
                                                    msg.delete();
                                                })
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                todo_interaction.channel.send({
                                                    content:'Irgendetwas ist falsch gelaufen!'
                                                }).then(async msg => {
                                                    await delay(3000);
                                                    msg.delete();
                                                })
                                            })

                                            await delay(5000);
                                            task.delete();
                                            count = count - 1;
                                    }
                                    break;

                                case 'next':
                                    await todo_interaction.message.edit({
                                        components: [new MessageActionRow({
                                            components: [newToDoButtons(true)[0], newToDoButtons(true)[1], newToDoButtons(true)[2]]
                                        })]
                                    });
                                    interactionCount--;
                                    break;

                                case 'cancel':
                                    count = count - 1;
                                    await todo_interaction.message.delete();
                                    interactionCount--;
                                    newToDocollector = null;
                                    todo_interaction = null;
                                    break;

                                case 'back':
                                    await todo_interaction.message.edit({
                                        components: [new MessageActionRow({
                                            components: [newToDoButtons()[0], newToDoButtons()[1], newToDoButtons()[2], newToDoButtons()[3], newToDoButtons()[4]]
                                        })]
                                    });
                                    interactionCount--;
                                    break;
                            }

                            var messageCollector = await main_interaction.message.channel.createMessageCollector({
                                filter: (() => main_interaction.message.author.id),
                                max: 1
                            });

                            messageCollector.on('collect', async reply => {
                                switch (todo_interaction.customId) {
                                    case 'add_title':
                                        title = reply.content;
                                        try {
                                            await task.edit({
                                                embeds: [newToDoEmbed(title, text, deadline, user)]
                                            });
                                        }catch(err) {
                                            if(err.code == '50035') { //String too long
                                                reply.reply({
                                                    content: 'Dein Titel ist zu lang!. Die perfekte Länge sind max. 50 Zeichen!'
                                                }).then(async msg => {
                                                    await delay(4000);
                                                    msg.delete();
                                                })
                                                await delay(4000);
                                            }
                                        }
                                        reply.delete();
                                        todo_interaction_reply.delete();
                                        interactionCount--;
                                        break;

                                    case 'add_text':
                                        text = reply.content;
                                        try {
                                            task.edit({
                                                embeds: [newToDoEmbed(title, text, deadline, user)]
                                            });
                                        }catch(err) {
                                            if(err.code == '50035') { //String too long
                                                reply.reply({
                                                    content: 'Dein Titel ist zu lang!. Die perfekte Länge sind max. 50 Zeichen!'
                                                }).then(async msg => {
                                                    await delay(4000);
                                                    msg.delete();
                                                })
                                                await delay(4000);
                                            }
                                        }
                                        reply.delete();
                                        todo_interaction_reply.delete();
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
                                                await delay(3000);
                                                msg.delete();
                                            })
                                        }
                                        reply.delete();
                                        todo_interaction_reply.delete();
                                        interactionCount--;
                                        break;

                                    case 'add_other':
                                        let other_user = reply.content.split(' ');

                                        for(let i in other_user) {
                                            other_user[i] = removeMention(other_user[i]);

                                            try {
                                                other_user[i] = main_interaction.message.guild.members.cache.find(member => member.id.includes(other_user[i])).user

                                            }catch(err) {
                                                reply.channel.send({
                                                    content: `Der Spieler wurde nicht gefunden!`
                                                }).then(async msg => {
                                                    await delay(3000);
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
                                        reply.delete();
                                        todo_interaction_reply.delete();
                                        interactionCount--;
                                        break;

                                    default:
                                        break;
                                }
                            });
                        });
                    case 'change_cat':
                        var old_int = todo_item_interaction;
                        todo_item_interaction = null;
                        var newSelectMenu = await addSelectMenu(categories, select_catId, add_catId)
                        old_int.message.edit({
                            components: [new MessageActionRow({
                                components: [newSelectMenu]
                            })]
                        });
                        if(count > 0) --count;
                        break;

                    case 'delete_toDo':
                        if(count < 0) count = 0;

                        count++;

                        if (count > 1) {
                            return;
                        }
                        var del_todoMessage = await todo_item_interaction.channel.send({
                            content: 'Bitte gebe die ID ein, von der Task, die du löschen möchtest. (Tipp: "cancel" bricht diesen Vorgang ab!)',
                            ephemeral: true
                        });

                        var messageCollectorDeleteToDo = await main_interaction.message.channel.createMessageCollector({
                            filter: (() => main_interaction.message.author.id),
                            time: 15000,
                            max: 1
                        });

                        messageCollectorDeleteToDo.on('collect', async reply => {
                            if(reply.content.toLowerCase() === 'cancel') {
                                await reply.reply({
                                    content: 'Abgebrochen!'
                                }).then(async msg => {
                                    await delay(3000);
                                    msg.delete();
                                });
                                count = count - 1;
                                reply.delete();
                                del_todoMessage.delete();
                                return;
                            }
                            if(isNaN(reply.content)) {
                                count = count - 1;
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
                                            count = count - 1;
                                            return reply.reply({
                                                content: 'Erfolgreich gelöscht!'
                                            }).then(async msg => {
                                                await delay(50000);
                                                reply.delete();
                                                msg.delete();
                                            })
                                        })
                                        .catch(err => {
                                            count = count - 1;
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
                                    count = count - 1;
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
                    case 'end_int':
                        var comp = todo_item_interaction.message.components[0].components
                        for(let i in comp) {
                            comp[i].setDisabled(true)
                        }
                        todolist.edit({components: [todo_item_interaction.message.components[0]]});
                        count = 0;
                        interactionCount = 0;
                    break;
                }
            });

            collector.on('end', (collected, reason) => {
                if(reason === 'time') {
                    var comp = todolist.components[0].components
                    for(let i in comp) {
                        comp[i].setDisabled(true)
                    }
                    todolist.edit({content: '**Time limit reached (60s)**', components: [todolist.components[0]]})
                }
            });

            return;
        }
    }
}