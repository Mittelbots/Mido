const { manageToDoItem } = require("../manageToDoItem/manageToDoitem");
const {increase_toDoInteractionCount, getCurrentProjectId, changeCurrentProjectId
} = require("../../../variables/variables");

module.exports = async (main_interaction) => {

    if (increase_toDoInteractionCount() > 1) {
        return;
    }

    if(!getCurrentProjectId()) changeCurrentProjectId(main_interaction.customId.split('_')[1])


    manageToDoItem({main_interaction, isNewTask: true});

    // const shortHandMessageCollector = main_interaction.message.channel.createMessageCollector({
    //     filter: ((user) => user.author.id === main_interaction.user.id),
    //     max: 1
    // });

    // shortHandMessageCollector.on('collect', async reply => {

    //     interactionCount++;
    //     if (interactionCount > 1) {
    //         return;
    //     }

    //     if (reply.content.toLowerCase() === 'cancel') {
    //         await reply.reply({
    //             content: lang.errors.canceled
    //         }).then(async msg => {
    //             await delay(3000);
    //             msg.delete();
    //         });
    //         decrease_toDoAddCount()
    //         reply.delete();
    //         return;
    //     }

    //     try {
    //         var content = reply.content.split(',');
    //     } catch (err) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.no_comma_in_shorthand
    //         }).then(async msg => {
    //             await delay(3000);
    //             msg.delete();
    //         });
    //         reply.delete();
    //         decrease_toDoAddCount()
    //         return;
    //     }

    //     title = content[0]; //!required
    //     text = content[1]; //!required
    //     deadline = content[2]; //!optional
    //     reminder = content[3]; //!optional
    //     other_user = content[4]; //!optional

    //     if (!title) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.title_missing
    //         }).then(async msg => {
    //             await delay(2000);
    //             msg.delete();
    //         });
    //         decrease_toDoAddCount()
    //         return;
    //     }
    //     if (!text) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.text_missing
    //         }).then(async msg => {
    //             await delay(2000);
    //             msg.delete();
    //         });
    //         decrease_toDoAddCount()
    //         return;
    //     }

    //     task.edit({
    //         embeds: [newToDoEmbed(title, text, deadline + dateFormatDC + `\n**${lang.todo.reminder}:** ${reminder} ${reminderFormatDC}`, user)]
    //     });

    // });
}