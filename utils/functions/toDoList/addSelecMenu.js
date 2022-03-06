const {
    MessageSelectMenu
} = require('discord.js');

const addSelectMenu = (categories, select_catId, add_catId) => {
    var menu = new MessageSelectMenu()
        .setCustomId(select_catId)
        .setPlaceholder((categories) ? 'Select category' : 'Füge eine neue hinzu.');

    if (categories !== false) {
        categories.map(cat => {
            menu.addOptions([{
                'value': select_catId + cat.id,
                'label': cat.name,
                'description': 'Klicke hier um Kategorie auszuwählen',
            }])
        })
    } else {
        menu.addOptions([{
            'value': add_catId,
            'label': 'Füge eine neue Kategorie hinzu.',
            'description': 'Klicke hier'
        }])
    }

    return menu;
}

module.exports = {
    addSelectMenu
}