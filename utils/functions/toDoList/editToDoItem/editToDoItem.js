const { increase_toDoInteractionCount, decrease_toDoInteractionCount } = require("../../../variables/variables");
const { delay } = require("../../delay/delay");
const { getLang } = require("../../getData/getLang");
const { manageToDoItem } = require("../manageToDoItem/manageToDoitem");


module.exports = async ({main_interaction}) => {

    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    const lang = require(`../../../assets/json/language/${await getLang(main_interaction.message.guild.id)}.json`)

    const sentMessage = await main_interaction.message.channel.send({
        content: 'Welche Aufgabe willst Du ändern? (Tippe die ID ein)',
    });

    const messageCollector = await main_interaction.message.channel.createMessageCollector({
        max: 1,
        filter: (m) => m.author.id === main_interaction.user.id
    });

    messageCollector.on('collect', async reply => {
        if (reply.content.toLowerCase() === 'cancel') {
            await reply.reply({
                content: lang.errors.canceled
            }).then(async msg => {
                await delay(3000);
                msg.delete();
                reply.delete();
                sentMessage.delete();
                decrease_toDoInteractionCount(main_interaction.user.id);
            });
            return;
        }

        if (isNaN(reply.content)) {
            return reply.reply({
                content: lang.errors.only_numbers
            }).then(async msg => {
                await delay(3000);
                msg.delete();
                reply.delete();
                sentMessage.delete();
                decrease_toDoInteractionCount(main_interaction.user.id);
            })
        }
        else {
            await manageToDoItem({main_interaction, isNewTask: false, toDoId: reply.content});
            
            await delay(2000);
            reply.delete();
            sentMessage.delete();
        }
    });
}