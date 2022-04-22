const fs = require('fs');
const { log } = require('../../../logs');
const secret_config = require('../../../_secret/secret_config/secret_config.json');

async function deployCommands({bot}) {
    let modules = fs.readdirSync('./src/commands/');

    modules.forEach((module) => {
        fs.readdir(`./src/commands/${module}`, (err, files) => {
            if (err) {
                if(err.path === './src/slash_commands/index.js') {return}
                else {
                    log.warn('Missing folder!', err)
                    if (secret_config.debug) console.log(`Mission Folder!!`, err);
                }
            }
            files.forEach((file) => {
                if (!file.endsWith('.js')) return;
                var command = require(`../../../src/commands/${module}/${file}`);
                console.log(`${command.help.name} Command has been loaded!`);
                if (command.help.name) {
                    bot.commands.set(command.help.name, command)
                }
            })
        });
    });
    return;
}

module.exports = {deployCommands};