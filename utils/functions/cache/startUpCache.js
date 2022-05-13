const { getAllConfig } = require("../getData/getConfig");
const { getAllPermissions } = require("../getData/getPermissions");
const { getAllPremium } = require("../premium/premium");
const { addToCache } = require("./cache");

module.exports.startUpCache = async () => {

    console.log('🚀Starting up cache...');


    console.log('🕐Getting all Data...');

    const guildConfigs = await getAllConfig();
    const guildPermissions = await getAllPermissions();
    const guildPremium = await getAllPremium();

    console.log('✅ Data collected...');

    console.log('🕐Adding to cache...');

    for(let i in guildConfigs) {
        addToCache({
            value: {
                name: "config",
                id: guildConfigs[i].guild_id,
                prefix: guildConfigs[i].prefix,
                log_channel: guildConfigs[i].log_channel,
            }
        });
    }

    for(let i in guildPermissions) {
        addToCache({
            value: {
                name: "permissions",
                id: guildPermissions[i].guild_id,
                view_tasks: guildPermissions[i].view_tasks,
                add_tasks: guildPermissions[i].add_tasks,
                edit_tasks: guildPermissions[i].edit_tasks,
                add_projects: guildPermissions[i].add_projects,
                delete_projects: guildPermissions[i].delete_projects,
                view_guild_archive: guildPermissions[i].view_guild_archive,
                view_user_archive: guildPermissions[i].view_user_archive,
                edit_guild_archive: guildPermissions[i].edit_guild_archive,
            }
        });
    }

    for(let i in guildPremium) {
        addToCache({
            value: {
                name: "premium",
                id: guildPremium[i].user_id,
                premium: guildPremium[i].premium,
                platin: guildPremium[i].platin,
            }
        });
    }

    console.log('✅ Everything is in cache...');
}