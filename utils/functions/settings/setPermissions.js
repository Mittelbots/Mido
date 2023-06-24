const database = require('../../../bot/db/db');
const { getLang } = require('../getData/getLang');
const { errorhandler } = require('../errorhandler/errorhandler');
const config = require('../../assets/json/_config/config.json');
const Permissions = require('../../class/Perms/Perms');

module.exports.setPermissions = async ({ main_interaction, permissions }) => {
    const lang = require(`../../assets/json/language/${await getLang(
        main_interaction.guild.id
    )}.json`);

    const roleId = permissions.role.id;

    const roleAlreadySet = await new Permissions()
        .isRoleIdAlreadyInPerms({
            roleId: roleId,
            guildId: main_interaction.guild.id,
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            //todo: add promise and stop execution here
        });

    let sqlQuery;

    if (roleAlreadySet) {
        sqlQuery = `UPDATE ${config.tables.mido_perms} SET role_id = ?, view_tasks = ?, add_tasks = ?, edit_tasks = ?, add_projects = ?, delete_projects = ?, view_user_archive = ?, view_guild_archive = ?, edit_guild_archive = ? WHERE guild_id = ? AND role_id = ?`;
    } else {
        sqlQuery = `INSERT INTO ${config.tables.mido_perms} (role_id, view_tasks, add_tasks, edit_tasks, add_projects, delete_projects, view_user_archive, view_guild_archive, edit_guild_archive, guild_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    return await database
        .query(sqlQuery, [
            roleId,
            permissions.viewtask,
            permissions.addtask,
            permissions.edittask,
            permissions.addproject,
            permissions.deleteProject,
            permissions.view_user_archive,
            permissions.view_guild_archive,
            permissions.edit_guild_archive,
            main_interaction.guild.id,
            roleId,
        ])
        .then(async () => {
            return {
                error: false,
                message: lang.settings.permissions.updated,
            };
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: lang.settings.permissions.error,
            };
        });
};
