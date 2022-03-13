const {
    MessageSelectMenu
} = require('discord.js');

const addSelectMenu = async (categories, select_catId, add_catId) => {
    var menu = new MessageSelectMenu()
        .setCustomId(select_catId)
        .setPlaceholder((categories) ? 'Projekt wählen' : 'Füge ein neues Projekt hinzu.')
        .addOptions([{
            'value': 'add_cat',
            'label': '----Projekt hinzufügen----',
            'description': 'Klicke hier um ein Projekt hinzuzufügen.'
        }])

    if (categories) {
        categories.map(cat => {
            menu.addOptions([{
                'value': select_catId + cat.id,
                'label': cat.name,
                'description': 'Klicke hier um ein Projekt auszuwählen.',
            }])
        })
    }

    return menu;
}

module.exports = {
    addSelectMenu
}