const { MessageButton } = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports.newToDoEmbed = (title, text, deadline, other_user) => {
    const messageEmbed = new MessageEmbed()
        .setTitle('Dein neuer Task im Überblick.')
        .addField('Titel:', (title) ? title : 'Noch nicht gesetzt. (required)')
        .addField('Text:', (text) ? text : 'Noch nicht gesetzt. (required)')
        .addField('Deadline:', (deadline) ? deadline : 'Noch nicht gesetzt. (optional)')
        .addField('Andere Nutzer:', (other_user) ? other_user : 'Noch nicht gesetzt. (optional)')
        .setTimestamp()


    return messageEmbed;
}


module.exports.newToDoButtons = (secondPage) => {
    const title_button = new MessageButton({
        style: 'SUCCESS',
        label: `Add Titel`,
        customId: 'add_title'
    });

    const text_button = new MessageButton({
        style: 'SUCCESS',
        label: `Add Text`,
        customId: 'add_text'
    });

    const deadline_button = new MessageButton({
        style: 'SECONDARY',
        label: `Add Deadline`,
        customId: 'add_deadline'
    });

    const other_button = new MessageButton({
        style: 'SECONDARY',
        label: `Add user`,
        customId: 'add_other'
    });

    const next_button = new MessageButton({
        style: 'SECONDARY',
        label: `NEXT`,
        customId: 'next'
    });

    const save_button = new MessageButton({
        style: 'SUCCESS',
        label: `Save`,
        customId: 'save'
    });

    const delete_button = new MessageButton({
        style: 'DANGER',
        label: `Cancel`,
        customId: 'cancel'
    });

    const back_button = new MessageButton({
        style: 'SECONDARY',
        label: `Back`,
        customId: 'back'
    })

    if(secondPage) {
        return [back_button, save_button, delete_button]
    }else {
        return [title_button, text_button, deadline_button, other_button, next_button]
    }
}