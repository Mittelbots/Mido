const {Database } = require('../../../bot/db/db');
const { errorhandler } = require('../errorhandler/errorhandler');

const database = new Database();

async function getCategory(channel) {
    return await database.query('SELECT * FROM hn_category')
        .then(res => {
            if(res.length <= 0) return false;

            res.map(todo => {

            });
        })
        .catch(err => {
            return errorhandler(err, 'Etwas ist schiefgelaufen! Versuche es erneut oder reporte den Bug.', channel);
        });
}

module.exports = {getCategory};