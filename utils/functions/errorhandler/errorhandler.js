const { log } = require("../../../logs");
const secret_config = require('../../../_secret/secret_config/secret_config.json');

function errorhandler(err, message, channel) {
    if(secret_config.debug) console.log(err, new Date());
    else log.fatal(err, new Date());

    if(channel && message) return channel.send(message); 
    
    return;
}

module.exports = {errorhandler}