const { MessageButton } = require('discord.js');
const { MessageActionRow } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { MessageSelectMenu  } = require('discord.js')
const config = require('../../../utils/assets/json/_config/config.json');
const { getCategory } = require('../../../utils/functions/getData/getCategory');
const { getToDo } = require('../../../utils/functions/getData/getToDo');
const { hasPermissions } = require('../../../utils/functions/hasPermissions/hasPermissions');

module.exports.run = async (bot, message, args) => {
  
    message.delete();

    if(!await hasPermissions(message.member)) {
        return message.reply('Du hast keine Berechtigung dafür.');
    }

    var todo = await getToDo(message.channel);
    var categories = await getCategory(message.channel);

    if(!todo) return message.channel.send('Keine To-Do Liste in der Datenbank.');


    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? 'Wähle eine neue Kategorie aus.' : 'Füge zuerst eine neue Kategorie hinzu.')
        .setTimestamp()

    const add_catId = 'add_cat';
    const select_catId = 'select_cat';


    var newMessageEmbedInteraction = new MessageActionRow()
        
    
    var dropdown = new MessageSelectMenu()

    dropdown.setCustomId(select_catId)
    dropdown.setPlaceholder('Select category')
    dropdown.addOptions([
        {
            label: 'test',
            description: 'this is a test',
            value: 'test_selections'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'test_selections1'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'test_selections2'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'test_seledctions3'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'tedst_sedwadaledctions'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'test_seddwadalecdtions'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'test_sedwaledctions'
        },
        {
            label: 'test',
            description: 'this is a test',
            value: 'testd_sdwaelections'
        }
    ])


    newMessageEmbedInteraction.addComponents([dropdown])

    message.reply({embeds: [newMessageEmbed], ephemeral: true, components: [newMessageEmbedInteraction]});

    var toDoMessageEmbed = new MessageEmbed()
        .setTitle('ToDo Liste von hautnah.')
        .setDescription('Anschauen, bearbeiten oder löschen.')
        .setTimestamp()

    todo.map(todo => {
        toDoMessageEmbed.addField('‎\n⏹️ ' + todo.title, '- _'+todo.text + '_ \n ');
    });


   // message.channel.send({embeds: [toDoMessageEmbed], components: [newMessageEmbedInteraction]});
}

module.exports.help = {
    name:"todo",
    description: "",
    usage: "todo"
}