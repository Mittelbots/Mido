const {Database} = require('../../../bot/db/db');

const database = new Database();

async function hasPermissions(user) {
    return database.query('SELECT * FROM hn_perms')
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