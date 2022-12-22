const { log, debug_log } = require('../../../logs');

function errorhandler({ err, message, channel, fatal }) {
    if (JSON.parse(process.env.BOT_DEBUG)) console.log(err, new Date());
    else if (fatal) log.fatal(err + ' ', new Date());
    else debug_log.info(err + ' ', message + ' ' || ' ', new Date());

    if (channel && message) return channel.send(message).catch((err) => {});

    return;
}

module.exports = { errorhandler };
