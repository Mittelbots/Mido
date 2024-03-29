const database = require('../db/db');
const config = require('../../utils/assets/json/_config/config.json');
const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');

module.exports.guildCreate = async ({ guild, bot }) => {
    database
        .query(`INSERT INTO ${config.tables.mido_config} (guild_id) VALUES (?)`, [guild.id])
        .then(() => {
            errorhandler({
                err: '',
                message: `Joined Guild ${guild.id} - ${guild.name}`,
                fatal: false,
            });
        })
        .catch((err) => {
            errorhandler({ err, fatal: true });
        });
};
