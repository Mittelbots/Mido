//? MODULES --
require('dotenv').config();
const { Client, EmbedBuilder, Options, GatewayIntentBits } = require('discord.js');
const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const { messageCreate } = require('../../bot/events/messageCreate');
const { welcome_message } = require('../../utils/functions/welcome_message/welcome_message');
const { watchToDoList } = require('../../utils/functions/watchToDoList/watchToDoList');
const { spawn } = require('child_process');
const {
    createSlashCommands,
} = require('../../utils/functions/createSlashCommands/createSlashCommands');
const { guildCreate } = require('../../bot/events/guildCreate');
const { interactionCreate } = require('../../bot/events/interactionCreate');
const {
    guildScheduledEventCreate,
} = require('../../utils/functions/guildScheduledEvent/guildScheduledEvent');
const { setActivity } = require('../../utils/functions/activity/setActivity');

//? JSON --
const config = require('../../utils/assets/json/_config/config.json');
const { startBot } = require('./startup');
const { delay } = require('../../utils/functions/delay/delay');
const { acceptBotInteraction } = require('./events/_handle');
const version = require('../../package.json').version;

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
    ],
});

bot.setMaxListeners(5);

bot.version = version;

createSlashCommands();

bot.on('guildCreate', async (guild) => {
    return await guildCreate({ guild, bot });
});

bot.on('messageCreate', (message) => {
    return messageCreate(message, bot);
});

bot.on('guildMemberAdd', async (member) => {
    return await welcome_message(member);
});

guildScheduledEventCreate(bot);

bot.once('ready', async function () {

    await startBot(bot)
        .then(() => {
            acceptBotInteraction(bot);
        })
        .catch(async (err) => {
            errorhandler({
                err,
                message: 'Error at startBot function',
                fatal: true,
            });
            await delay(10000);
        });

    setInterval(() => {
        setActivity(bot);
    }, 3600000); // 1h

    // watchToDoList(bot);
    // interactionCreate(bot);
});

bot.login(process.env.BOT_TOKEN);

//! ERROR --
process.on('unhandledRejection', (err) => {
    errorhandler({ err, fatal: true });

    errorhandler({ err: `---- BOT RESTARTED..., ${new Date()}`, fatal: false });
    spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ['ignore', null, null],
    }).unref();
    process.exit();
});

process.on('uncaughtException', (err) => {
    errorhandler({ err, fatal: true });

    errorhandler({ err: `---- BOT RESTARTED..., ${new Date()}`, fatal: false });
    spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ['ignore', null, null],
    }).unref();
    process.exit();
});
