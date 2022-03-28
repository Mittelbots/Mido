const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json')

async function hasPermissions(user) {
    return database.query(`SELECT * FROM ${config.tables.mido_perms} WHERE guild_id = ?`, user.guild.id)
        .then(res => {
            var hasPermission = false;
            
            res.map(perms => {
                if(user.roles.cache.find(r => r.id === perms.role_id)) {
                    return hasPermission = true;
                }
            });

            return hasPermission;
        })
        .catch(err => {
            console.log(err);
        });
}

module.exports = { hasPermissions }