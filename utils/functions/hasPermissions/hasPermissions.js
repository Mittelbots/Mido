const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
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

module.exports.hasPermissions = async ({user, needed_permission}) => {
    if (!user || !needed_permission || typeof needed_permission != 'object') {
        return false;
    }

    for(let i in needed_permission) if(needed_permission[i] == 0) delete needed_permission[i]

    return database.query(`SELECT * FROM ${config.tables.mido_perms} WHERE guild_id = ?`, user.guild.id)
        .then(res => {
            var hasPermission = false;
            
            res.map(perms => {
                if(user.roles.cache.find(r => r.id === perms.role_id)) {
                    for (const [index, [key, value]] of Object.entries(Object.entries(needed_permission))) {
                        if(perms[key] !== value) {
                            return hasPermission = false;
                        }else {
                            hasPermission = true;
                        }
                      }
                }
            });
            return hasPermission;
        })
        .catch(err => {
            errorhandler(err, `Error in hasPermissions.js`, null);
            return false;
        });
}