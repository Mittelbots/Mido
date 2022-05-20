const { log, debug_log } = require("../../../logs");
const secret_config = require('../../../_secret/secret_config/secret_config.json');

function errorhandler({err, message, channel, fatal}) {
    if(secret_config.debug) console.log(err, new Date());
    else if(fatal) log.fatal(err, new Date());
    else debug_log.info(err, message || '', new Date());

    if(channel && message) return channel.send(message); 
    
    return;
}

module.exports = {errorhandler}