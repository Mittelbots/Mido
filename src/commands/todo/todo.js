const {
    MessageActionRow,
    MessageEmbed,
    MessageSelectMenu
} = require('discord.js');
const { Database } = require('../../../bot/db/db');
const config = require('../../../utils/assets/json/_config/config.json');
const { errorhandler } = require('../../../utils/functions/errorhandler/errorhandler');
const {
    getCategory
} = require('../../../utils/functions/getData/getCategory');
const {
    getToDo
} = require('../../../utils/functions/getData/getToDo');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');

const database = new Database();

module.exports.run = async (bot, message, args) => {
    if (!await hasPermissions(message.member)) {
        return message.reply('Du hast keine Berechtigung dafür.');
    }

    var todo = await getToDo(message.channel);
    var categories = await getCategory(message.channel);

    if (!todo) return message.channel.send('Keine To-Do Liste in der Datenbank.');


    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? 'Wähle eine neue Kategorie aus.' : 'Füge zuerst eine neue Kategorie hinzu.')
        .setTimestamp()

    const add_catId = 'add_cat';
    const select_catId = 'select_cat';

    var selectMenu = new MessageSelectMenu()
        .setCustomId(select_catId)
        .setPlaceholder((categories) ? 'Select category' : 'Füge eine neue hinzu.');

        if(categories !== false) {
            categories.map(cat => {
                selectMenu.addOptions([{
                    'value': select_catId + cat.id,
                    'label': cat.name,
                    'description': 'Klicke hier um Kategorie auszuwählen',
                }])
            })
        }else {
            selectMenu.addOptions([{
                'value': add_catId,
                'label': 'Füge eine neue Kategorie hinzu.',
                'description': 'Klicke hier'
            }])
        }


    var newMessageEmbedInteraction = new MessageActionRow()
        .addComponents(selectMenu)

    message.reply({
        embeds: [newMessageEmbed],
        components: [newMessageEmbedInteraction]
    });

    bot.on('interactionCreate', async (interaction) => {
        if(interaction.isSelectMenu() && interaction.customId === 'select_cat') {
            await interaction.deferUpdate();
            if(interaction.values.indexOf(add_catId) !== -1) {
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

            }
            categories.map(cat => {
                if(interaction.values.indexOf(select_catId + cat.id) !== -1) {

                    newMessageEmbed.setTitle(`ToDo Liste - ${cat.name}`)
                    newMessageEmbed.setColor(cat.color)
                    todo.map(todo =>{
                        newMessageEmbed.addField('‎\n⏹️ ' + todo.title, '- _' + todo.text + '_ \n ');
                    })

                    interaction.message.edit({
                        embeds: []
                    })

                    return interaction.message.edit({
                        embeds: [newMessageEmbed]
                    })
                }
            });
        }
    });
}

module.exports.help = {
    name: "todo",
    description: "",
    usage: "todo"
}