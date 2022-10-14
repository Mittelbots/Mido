const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');
const { errorhandler } = require('../errorhandler/errorhandler');

module.exports.getAllPermissions = async () => {
    return await database
        .query(`SELECT * FROM ${config.tables.mido_perms}`)
        .then((res) => {
            if (res.length === 0) return false;
            return res;
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
            return false;
        });
};
