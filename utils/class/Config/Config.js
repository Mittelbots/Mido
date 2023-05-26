const MidoConfig = require('../../../bot/db/Models/mido_config.model');

class Config {
    constructor() {}

    get(guild_id) {
        return new Promise(async (resolve, reject) => {
            MidoConfig.findOne({
                where: {
                    guild_id: guild_id,
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
                        guild_id: guild_id,
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

module.exports = Config;
