const database = require('../../../bot/db/db');
const config = require('../../assets/json/_config/config.json');

module.exports.getAllPermissions = async () => {
    return await database.query(`SELECT * FROM ${config.tables.mido_perms}`)
        .then(res => {
            if (res.length === 0) return false;
            return res;
        }).catch(err => {
            console.log(err);
            return false;
        });
}