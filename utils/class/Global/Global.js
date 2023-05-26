const MidoGlobal = require('../../../bot/db/Models/mido_global.model');

class Global {
    constructor() {}

    get(guild_id) {
        return new Promise(async (resolve, reject) => {
            MidoGlobal.findOne({
                where: {
                    id: 1,
                },
            })
                .then((config) => {
                    return resolve(config);
                })
                .catch(() => {
                    return reject();
                });
        });
    }

    update(guild_id, value, field) {
        return new Promise(async (resolve, reject) => {
            MidoConfig.update(
                {
                    [field]: value,
                },
                {
                    where: {
                        id: 1,
                    },
                }
            )
                .then((config) => {
                    return resolve(config);
                })
                .catch(() => {
                    return reject();
                });
        });
    }
}

module.exports = Global;
