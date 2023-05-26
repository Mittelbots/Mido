const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const fs = require('node:fs');

module.exports.createSlashCommands = async () => {
    const commands = [];
    const modules = fs.readdirSync('./src/slash_commands').filter((file) => file !== 'index.js');

    // Place your client and guild ids here
    const clientId = process.env.BOT_APPLICATION_ID;
    const guildId = process.env.BOT_DEV_GUILD;

    for (const cmd_folder of modules) {
        const files = fs.readdirSync(`./src/slash_commands/${cmd_folder}/`);
        for (const command_file of files) {
            if (command_file.startsWith('._')) continue;

            console.log(`${command_file} Command has been loaded!`);
            const command = require(`../../../src/slash_commands/${cmd_folder}/${command_file}`);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST({
        version: '10',
    }).setToken(process.env.BOT_TOKEN);

    (async () => {
        try {
            console.log('🕐 Started refreshing application (/) commands.');

            if (process.env.NODE_ENV === 'development') {
                console.info('🕐 Started refreshing in Development.');
                await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                    body: commands,
                });
            } else {
                console.info('🕐 Started refreshing in Production.');
                await rest.put(Routes.applicationCommands(clientId), {
                    body: commands,
                });
            }

            console.log('✅ Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();
};

module.exports.loadCommandList = async (bot) => {
    const modules = fs.readdirSync('./src/slash_commands').filter((file) => file !== 'index.js');

    const commands = [];
    const cmd = [];

    for (const cmd_folder of modules) {
        if (cmd_folder.startsWith('._') || cmd_folder.startsWith('_')) continue;
        const files = fs.readdirSync(`./src/slash_commands/${cmd_folder}/`);
        for (const command_file of files) {
            if (command_file.startsWith('._')) continue;
            console.info(`${command_file} Command has been loaded!`);
            const command = require(`../../../src/slash_commands/${cmd_folder}/${command_file}`);
            commands.push(command.data.toJSON());
            cmd.push(command);
        }
    }

    return {
        commands,
        cmd,
    };
};
