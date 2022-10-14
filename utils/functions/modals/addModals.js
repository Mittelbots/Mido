const { TextInputBuilder, ActionRowBuilder, ModalBuilder, TextInputStyle } = require('discord.js');

module.exports.newToDoModals = ({ isNew = false, editData = {} }) => {
    const title = new TextInputBuilder()
        .setLabel('Title')
        .setCustomId(`${isNew ? 'new' : 'edit'}ToDo_Title`)
        .setStyle(TextInputStyle.Short)
        .setValue(editData.title || '')
        .setRequired(true);

    const text = new TextInputBuilder()
        .setLabel('Text')
        .setCustomId(`${isNew ? 'new' : 'edit'}ToDo_text`)
        .setStyle(TextInputStyle.Paragraph)
        .setValue(editData.text || '')
        .setRequired(false);

    const deadline = new TextInputBuilder()
        .setLabel('Deadline')
        .setCustomId(`${isNew ? 'new' : 'edit'}ToDo_deadline`)
        .setStyle(TextInputStyle.Short)
        .setValue(editData.deadline || '')
        .setRequired(false);

    const reminder = new TextInputBuilder()
        .setLabel('Reminder')
        .setCustomId(`${isNew ? 'new' : 'edit'}ToDo_reminder`)
        .setStyle(TextInputStyle.Short)
        .setValue(editData.reminder || '')
        .setRequired(false);

    const user = new TextInputBuilder()
        .setLabel('User')
        .setCustomId(`${isNew ? 'new' : 'edit'}ToDo_user`)
        .setStyle(TextInputStyle.Short)
        .setValue(editData.user || '')
        .setRequired(false);

    const modal = new ModalBuilder()
        .setTitle(`${isNew ? 'Add' : 'Edit'} your new ToDo.`)
        .setCustomId(`${isNew ? 'new' : 'edit'}ToDo_Modal`)
        .setComponents(
            new ActionRowBuilder().setComponents([title]),
            new ActionRowBuilder().setComponents([text]),
            new ActionRowBuilder().setComponents([deadline]),
            new ActionRowBuilder().setComponents([reminder]),
            new ActionRowBuilder().setComponents([user])
        );

    return modal;
};

module.exports.newEditToDoModals = () => {
    const id = new TextInputBuilder()
        .setLabel('Task id')
        .setCustomId(`editToDo_id`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const modal = new ModalBuilder()
        .setTitle('Enter the task id')
        .setCustomId(`editToDo_Id`)
        .setComponents(new ActionRowBuilder().setComponents([id]));

    return modal;
};
