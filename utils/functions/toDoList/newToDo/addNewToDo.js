const { manageToDoItem } = require('../manageToDoItem/manageToDoitem');
const {
    increase_toDoInteractionCount,
    getCurrentProjectId,
    changeCurrentProjectId,
} = require('../../../variables/variables');
const { hasPermissions } = require('../../hasPermissions/hasPermissions');
const { getLang } = require('../../getData/getLang');
const { delay } = require('../../delay/delay');

module.exports = async (main_interaction) => {
    const lang = require(`../../../assets/json/language/${await getLang(
        main_interaction.guild.id
    )}.json`);

    const hasPerms = await hasPermissions({
        user: main_interaction.member,
        needed_permission: {
            view_tasks: 1,
            add_tasks: 1,
        },
    });

    if (!hasPerms) {
        return main_interaction.message.reply(lang.errors.noperms).then(async (msg) => {
            await delay(2000);
            await msg.delete().catch((err) => {});
        });
    }

    if (increase_toDoInteractionCount(main_interaction.user.id) > 1) {
        return;
    }

    if (!getCurrentProjectId(main_interaction.user.id))
        changeCurrentProjectId(main_interaction.customId.split('_')[1], main_interaction.user.id);

    manageToDoItem({ main_interaction, isNewTask: true });

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
    //             msg.delete().catch(err => {});
    //         });
    //         decrease_toDoAddCount(main_interaction.user.id)
    //         reply.delete().catch(err => {});
    //         return;
    //     }

    //     try {
    //         var content = reply.content.split(',');
    //     } catch (err) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.no_comma_in_shorthand
    //         }).then(async msg => {
    //             await delay(3000);
    //             msg.delete().catch(err => {});
    //         });
    //         reply.delete().catch(err => {});
    //         decrease_toDoAddCount(main_interaction.user.id)
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
    //             msg.delete().catch(err => {});
    //         });
    //         decrease_toDoAddCount(main_interaction.user.id)
    //         return;
    //     }
    //     if (!text) {
    //         await reply.reply({
    //             content: lang.todo.newtodo.errors.text_missing
    //         }).then(async msg => {
    //             await delay(2000);
    //             msg.delete().catch(err => {});
    //         });
    //         decrease_toDoAddCount(main_interaction.user.id)
    //         return;
    //     }

    //     task.edit({
    //         embeds: [newToDoEmbed(title, text, deadline + dateFormatDC + `\n**${lang.todo.reminder}:** ${reminder} ${reminderFormatDC}`, user)]
    //     });

    // });
};
