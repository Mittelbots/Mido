const { MessageActionRow } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const database = require("../../../bot/db/db");
const { delay } = require("../delay/delay");
const { errorhandler } = require("../errorhandler/errorhandler");
const { refreshCategories_ToDo } = require("../getData/refreshCategories_ToDo");
const { addSelectMenu } = require("../toDoList/addSelecMenu");

module.exports.addProject = async (main_interaction, count) => {
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
                const refresh = await refreshCategories_ToDo(main_interaction);
                categories = refresh[0];

                var newMessageEmbed = new MessageEmbed()
                .setTitle('Wähle ein neues Projekt aus.')
                .setTimestamp()

                const newSelectMenu = await addSelectMenu(categories)

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
}