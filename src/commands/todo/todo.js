const {
    MessageActionRow,
    MessageEmbed
} = require('discord.js');
const { delay } = require('../../../utils/functions/delay/delay');
const {
    getCategory
} = require('../../../utils/functions/getData/getCategory');
const {
    hasPermissions
} = require('../../../utils/functions/hasPermissions/hasPermissions');
const { removeMention } = require('../../../utils/functions/removeCharacters/removeCharacters');
const {
    addSelectMenu
} = require('../../../utils/functions/toDoList/addSelecMenu');
const { viewUserToDo } = require('../../../utils/functions/toDoList/viewUserToDo');

module.exports.run = async (bot, message, args) => {
    if (!await hasPermissions(message.member)) {
        return message.reply('Du hast keine Berechtigung dafür. Falls dies falsch ist, kontaktiere den Discord Support.');
    }

    var value = args[0];
    if(value) {
        try {
            value = removeMention(value);
            message.guild.members.cache.find(member => member.id.includes(value));
        }catch(err) {
            console.log(err);
            return message.reply({
                content: `Der Spieler wurde nicht gefunden!`
            }).then(async msg => {
                await delay(3000);
                msg.delete();
            })

        }
        const embed = await viewUserToDo(value, message.guild.id, message.channel);
        if(!embed) {
            return message.reply({
                content: 'Dieser Nutzer hat keine aktiven Tasks!'
            }).then(async msg => {
                await delay(3000);
                msg.delete();
                message.delete();
            })
        }else {
            return message.reply({
                embeds: [embed]
            });
        }
    }

    var categories = await getCategory(message.channel);

    var newMessageEmbed = new MessageEmbed()
        .setTitle((categories) ? 'Wähle ein neues Projekt aus.' : 'Füge zuerst ein neues Projekt hinzu.')
        .setTimestamp()

    var newMessageEmbedInteraction = await addSelectMenu(categories, false);
    await message.reply({
        embeds: [newMessageEmbed],
        components: [new MessageActionRow({
            components: [newMessageEmbedInteraction]
        })]
    }); 
    

    return;
}
module.exports.help = {
    name: "todo",
    description: "",
    usage: "todo"
}