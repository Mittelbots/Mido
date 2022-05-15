const { getRoleFromPermissions } = require("../getData/getRoleFromPermissions");
const database = require('../../../bot/db/db');
const { getLang } = require("../getData/getLang");
const { errorhandler } = require("../errorhandler/errorhandler");
const config = require('../../assets/json/_config/config.json');
const { updateCache } = require("../cache/cache");

module.exports.setPermissions = async ({main_interaction, permissions}) => {
    const lang = require(`../../assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const roleId = permissions.role.id;

    const roleAlreadySet = await getRoleFromPermissions({
        roleId: roleId,
        guildId: main_interaction.guild.id
    });

    var sqlQuery;

    if(roleAlreadySet.error) {
        return roleAlreadySet;
    }else if(roleAlreadySet.hasRole) {
        sqlQuery = `UPDATE ${config.tables.mido_perms} SET role_id = ?, view_tasks = ?, add_tasks = ?, edit_tasks = ?, add_projects = ?, delete_projects = ?, view_user_archive = ?, view_guild_archive = ?, edit_guild_archive = ? WHERE guild_id = ? AND role_id = ?`;
    }else {
        sqlQuery = `INSERT INTO ${config.tables.mido_perms} (role_id, view_tasks, add_tasks, edit_tasks, add_projects, delete_projects, view_user_archive, view_guild_archive, edit_guild_archive, guild_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    return await database.query(sqlQuery, [roleId, permissions.viewtask, permissions.addtask, permissions.edittask, permissions.addproject, permissions.deleteProject, permissions.view_user_archive, permissions.view_guild_archive, permissions.edit_guild_archive , main_interaction.guild.id, roleId])
        .then(() => {
            updateCache({
                cacheName: "permissions",
                param_id: main_interaction.guild.id,
                value: {
                    view_tasks: permissions.view_tasks,
                    add_tasks: permissions.add_tasks,
                    edit_tasks: permissions.edit_tasks,
                    add_projects: permissions.add_projects,
                    delete_projects: permissions.delete_projects,
                    view_guild_archive: permissions.view_guild_archive,
                    view_user_archive: permissions.view_user_archive,
                    edit_guild_archive: permissions.edit_guild_archive,
                }
            });
            return {
                error: false,
                message: lang.settings.permissions.updated
            }
        })
        .catch(err => {
            errorhandler(err);
            return {
                error: true,
                message: lang.settings.permissions.error
            }
        })
}