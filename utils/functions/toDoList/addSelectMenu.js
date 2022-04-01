const {
    MessageSelectMenu
} = require('discord.js');
const { select_ProjectId, add_ProjectId, delete_Project, cancel_delete_project } = require('../../variables/variables');
const { getLang } = require('../getData/getLang');

const addSelectMenu = async (projects, isDelete, guild_id) => {
    const lang = require(`../../assets/json/language/${await getLang(guild_id)}.json`)

    var menu = new MessageSelectMenu()
        .setCustomId((isDelete) ? delete_Project : select_ProjectId)
        .setPlaceholder((projects) ? lang.projects.selectmenu.choose_project : lang.projects.selectmenu.add_new_project)
        
    if(!isDelete) {
        menu.addOptions([{
            'value': add_ProjectId,
            'label': `----${lang.projects.selectmenu.add_new_project}----`,
            'description': lang.projects.selectmenu.add_new_project_desc
        }])
    }

    if (projects) {
        projects.map(cat => {
            menu.addOptions([{
                'value': (isDelete) ? 'del_' + cat.id : select_ProjectId + cat.id,
                'label': cat.name,
                'description': lang.projects.selectmenu.choose_project_desc,
            }])
        })
        if(!isDelete) {
            menu.addOptions([{
                'value': delete_Project,
                'label': `----${lang.projects.selectmenu.delete_project}----`,
                'description': lang.projects.selectmenu.delete_project_desc
            }])
        }

        if(isDelete) {
            menu.addOptions([{
                'value': cancel_delete_project,
                'label': `----${lang.projects.selectmenu.cancel_delete}----`,
                'description': lang.projects.selectmenu.cancel_delete_desc
            }])
        }
    }

    return menu;
}

const addConfirmMenu = async () => {
    let menu = new MessageSelectMenu()
        .setCustomId('confirmDelete')
        .setPlaceholder('Bitte bestätigen')
        .addOptions([{
            'value': 'yes',
            'label': 'yes',
            'description': 'Das Projekt wird automatisch gelöscht.'
        }])
        .addOptions([{
            'value': 'no',
            'label': 'no',
            'description': 'Der Vorgang wird abgebrochen.'
        }])

    return menu;
}

module.exports = {
    addSelectMenu,
    addConfirmMenu
}