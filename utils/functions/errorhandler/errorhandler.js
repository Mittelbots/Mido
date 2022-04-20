const { log } = require("../../../logs");
const config = require('../../assets/json/_config/config.json');

function errorhandler(err, message, channel) {
    if(config.debug) console.log(err, new Date());
    else log.fatal(err, new Date());

    if(channel && message) return channel.send(message); 
    
    return;
}

module.exports = {errorhandler}