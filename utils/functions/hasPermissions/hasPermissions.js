const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
const { getFromCache } = require('../cache/cache');
const { errorhandler } = require('../errorhandler/errorhandler');

/**
 *
 * @param {object} user
 * @param {object} permission
 * + @param {int} view tasks
 * + @param {int} add tasks
 * + @param {int} edit tasks
 * + @param {int} add projects
 * + @param {int} delete projects
 * @returns {boolean}
 */

module.exports.hasPermissions = async ({ user, needed_permission }) => {
    if (!user || !needed_permission || typeof needed_permission != 'object') {
        return false;
    }

    for (let i in needed_permission) if (needed_permission[i] == 0) delete needed_permission[i];

    var permissions;

    permissions = await getFromCache({
        cacheName: 'permissions',
        param_id: user.guild.id,
    });

    if (!permissions) {
        permissions = await database
            .query(`SELECT * FROM ${config.tables.mido_perms} WHERE guild_id = ?`, user.guild.id)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                errorhandler({ err, fatal: true });
                return false;
            });
    }

    var hasPermission = false;

    for (let i in permissions) {
        if (user.roles.cache.find((r) => r.id === permissions[i].role_id)) {
            for (const [index, [key, value]] of Object.entries(Object.entries(needed_permission))) {
                try {
                    delete permissions[i].id;
                    delete permissions[i].role_id;
                    delete permissions[i].name;

                    permissions[i].filter(Boolean);
                } catch (err) {}

                if (permissions[i][key] !== value) {
                    return (hasPermission = false);
                } else {
                    hasPermission = true;
                }
            }
        }
    }
    return hasPermission;
};
