const { Database } = require('../../../bot/db/db');
const { errorhandler } = require('../errorhandler/errorhandler');

const database = new Database();

async function getToDo(channel) {
    return await database.query('SELECT * FROM hn_todo')
        .then(res => {
            if(res.length <= 0) return false;

            return res;
        })
        .catch(err => {
            return errorhandler(err, 'Etwas ist schiefgelaufen! Versuche es erneut oder reporte den Bug.', channel);
        });
}

module.exports = {getToDo};