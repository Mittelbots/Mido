const { log } = require("../../../logs");
const config = require('../../assets/json/_config/config.json');

function errorhandler(err, message, channel) {
    if(config.debug == 'true') console.log(err);
    else log.fatal(err);

    if(channel && message) return channel.send(message); 
    
    return;
}

module.exports = {errorhandler}