const {
    MessageSelectMenu
} = require('discord.js');
const { select_ProjectId, add_ProjectId, delete_Project } = require('../../variables/variables');

const addSelectMenu = async (categories, isDelete) => {
    var menu = new MessageSelectMenu()
        .setCustomId((isDelete) ? delete_Project : select_ProjectId)
        .setPlaceholder((categories) ? 'Projekt wählen' : 'Füge ein neues Projekt hinzu.')
        
    if(!isDelete) {
        menu.addOptions([{
            'value': add_ProjectId,
            'label': '----Projekt hinzufügen----',
            'description': 'Klicke hier um ein Projekt hinzuzufügen.'
        }])
    }

    if (categories) {
        categories.map(cat => {
            menu.addOptions([{
                'value': (isDelete) ? 'del_' + cat.id : select_ProjectId + cat.id,
                'label': cat.name,
                'description': 'Klicke hier um ein Projekt auszuwählen.',
            }])
        })
        if(!isDelete) {
            menu.addOptions([{
                'value': delete_Project,
                'label': '----Projekt löschen----',
                'description': 'Klicke hier um ein Projekt zu löschen.'
            }])
        }
    }

    return menu;
}

module.exports = {
    addSelectMenu
}