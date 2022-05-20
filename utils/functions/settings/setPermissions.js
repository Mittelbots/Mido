const { getRoleFromPermissions } = require("../getData/getRoleFromPermissions");
const database = require('../../../bot/db/db');
const { getLang } = require("../getData/getLang");
const { errorhandler } = require("../errorhandler/errorhandler");
const config = require('../../assets/json/_config/config.json');
const { updateCache, addToCache } = require("../cache/cache");

module.exports.setPermissions = async ({main_interaction, permissions}) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const roleId = permissions.role.id;

    const roleAlreadySet = await getRoleFromPermissions({
        roleId: roleId,
        guildId: main_interaction.guild.id
    });

    var sqlQuery;
    var isNew = false;

    if(roleAlreadySet.error) {
        return roleAlreadySet;
    }else if(roleAlreadySet.hasRole) {
        sqlQuery = `UPDATE ${config.tables.mido_perms} SET role_id = ?, view_tasks = ?, add_tasks = ?, edit_tasks = ?, add_projects = ?, delete_projects = ?, view_user_archive = ?, view_guild_archive = ?, edit_guild_archive = ? WHERE guild_id = ? AND role_id = ?`;
    }else {
        isNew = true;
        sqlQuery = `INSERT INTO ${config.tables.mido_perms} (role_id, view_tasks, add_tasks, edit_tasks, add_projects, delete_projects, view_user_archive, view_guild_archive, edit_guild_archive, guild_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    return await database.query(sqlQuery, [roleId, permissions.viewtask, permissions.addtask, permissions.edittask, permissions.addproject, permissions.deleteProject, permissions.view_user_archive, permissions.view_guild_archive, permissions.edit_guild_archive , main_interaction.guild.id, roleId])
        .then(async () => {
            const updateVal = {
                view_tasks: Number(permissions.viewtask),
                add_tasks: Number(permissions.addtask),
                edit_tasks: Number(permissions.edittask),
                add_projects: Number(permissions.addproject),
                delete_projects: Number(permissions.deleteProject),
                view_guild_archive: Number(permissions.view_guild_archive),
                view_user_archive: Number(permissions.view_user_archive),
                edit_guild_archive: Number(permissions.edit_guild_archive),
            }

            if(isNew) {
                await addToCache({
                    value: {
                        name: "permissions",
                        id: main_interaction.guild.id,
                        role_id: roleId,
                        data: updateVal
                    }
                })
            }else {
                await updateCache({
                    cacheName: "permissions",
                    param_id: roleId,
                    updateVal: updateVal
                });
            }
            return {
                error: false,
                message: lang.settings.permissions.updated
            }
        })
        .catch(err => {
            errorhandler({err, fatal: true});
            return {
                error: true,
                message: lang.settings.permissions.error
            }
        })
}