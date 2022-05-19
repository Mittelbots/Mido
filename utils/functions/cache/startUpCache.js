const { getAllConfig } = require("../getData/getConfig");
const { getAllPermissions } = require("../getData/getPermissions");
const { getAllPremium } = require("../premium/premium");
const { addToCache } = require("./cache");

module.exports.startUpCache = async () => {

    console.log('----------------------------------------');
    console.log('🚀Starting up cache...');


    console.log('🕐Getting all Data...');

    const guildConfigs = await getAllConfig();
    const guildPermissions = await getAllPermissions();
    const guildPremium = await getAllPremium();

    console.log('✅ Data collected...');

    console.log('🕐Adding to cache...');

    for(let i in guildConfigs) {
        await addToCache({
            value: {
                name: "config",
                data: {
                    id: guildConfigs[i].guild_id,
                    prefix: guildConfigs[i].prefix,
                    lang: guildConfigs[i].lang,
                    log_channel: guildConfigs[i].log_channel,
                }
            }
        });
    }

    for(let i in guildPermissions) {
        await addToCache({
            value: {
                name: "permissions",
                data: {
                    id: guildPermissions[i].guild_id,
                    role_id: guildPermissions[i].role_id,
                    view_tasks: guildPermissions[i].view_tasks,
                    add_tasks: guildPermissions[i].add_tasks,
                    edit_tasks: guildPermissions[i].edit_tasks,
                    add_projects: guildPermissions[i].add_projects,
                    delete_projects: guildPermissions[i].delete_projects,
                    view_guild_archive: guildPermissions[i].view_guild_archive,
                    view_user_archive: guildPermissions[i].view_user_archive,
                    edit_guild_archive: guildPermissions[i].edit_guild_archive,
                }
            }
        });
    }

    for(let i in guildPremium) {
        await addToCache({
            value: {
                name: "premium",
                data: {
                    id: guildPremium[i].user_id,
                    premium: guildPremium[i].premium,
                    platin: guildPremium[i].platin,
                }
            }
        });
    }

    console.log('✅ Everything is in cache...');
    console.log('----------------------------------------');
}