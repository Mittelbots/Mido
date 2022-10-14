const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require('../errorhandler/errorhandler');
const { getLang } = require('./getLang');

module.exports.getRoleFromPermissions = async ({ roleId, guildId }) => {
    const lang = require(`../../assets/json/language/${await getLang(guildId)}.json`);

    return await database
        .query(
            `SELECT role_id FROM ${config.tables.mido_perms} WHERE guild_id = ? AND role_id = ?`,
            [guildId, roleId]
        )
        .then((res) => {
            if (res.length > 0) {
                return {
                    error: false,
                    hasRole: true,
                };
            } else {
                return {
                    error: false,
                    hasRole: false,
                };
            }
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return {
                error: true,
                message: lang.errors.general,
            };
        });
};
