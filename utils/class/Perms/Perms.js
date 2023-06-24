const MidoPerms = require('../../../bot/db/Models/mido_perms.model');

class Permissions {
    constructor() {}

    isRoleIdAlreadyInPerms(guild_id, role_id) {
        return new Promise((resolve, reject) => {
            MidoPerms.findOne({
                where: {
                    guild_id: guild_id,
                    role_id: role_id,
                },
            })
                .then((res) => {
                    return resolve(res.length > 0 ? true : false);
                })
                .catch(() => {
                    return reject(false);
                });
        });
    }
}

module.exports = Permissions;
