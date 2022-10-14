//? MODULES --
require('dotenv').config();
const { Client, EmbedBuilder, Options, GatewayIntentBits } = require('discord.js');
const { errorhandler } = require('./utils/functions/errorhandler/errorhandler');
const { messageCreate } = require('./bot/events/messageCreate');
const { getLinesOfCode } = require('./utils/functions/getLinesOfCode/getLinesOfCode');
const { log } = require('./logs');
const { welcome_message } = require('./utils/functions/welcome_message/welcome_message');
const { watchToDoList } = require('./utils/functions/watchToDoList/watchToDoList');
const { spawn } = require('child_process');

const {
    createSlashCommands,
} = require('./utils/functions/createSlashCommands/createSlashCommands');
const { guildCreate } = require('./bot/events/guildCreate');
const { db_backup } = require('./bot/db/db_backup');

//? JSON --
const config = require('./utils/assets/json/_config/config.json');
const activity = require('./utils/assets/json/activity/activity.json');
const { startUpCache } = require('./utils/functions/cache/startUpCache');
const { interactionCreate } = require('./bot/events/interactionCreate');
const {
    guildScheduledEventCreate,
} = require('./utils/functions/guildScheduledEvent/guildScheduledEvent');
const version = require('./package.json').version;

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
    makeCache: Options.cacheWithLimits({
        MessageManager: 10,
        PresenceManager: 0,
        disableMentions: '@everyone, @here',
        // Add more class names here
    }),
});

bot.setMaxListeners(5);

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
    await startUpCache();

    if (!JSON.parse(process.env.BOT_DEBUG)) {
        db_backup();
        setTimeout(() => {
            db_backup();
        }, 86400000); // 24h
    }

    watchToDoList(bot);
    interactionCreate(bot);

    getLinesOfCode((cb) => {
        var codeLines = ` | Lines of Code: ${cb}` || '';
        bot.user.setActivity({
            name: activity.playing.name + ' v' + version + codeLines,
            type: activity.playing.type,
        });
    });

    console.info(
        `****Ready! Logged in as ${bot.user.tag}! I'm on ${bot.guilds.cache.size} Server****`,
        new Date()
    );

    bot.on('debug', (debug) => {
        var Message = new EmbedBuilder().setDescription(`**Debug info: ** \n ${debug}`);

        try {
            if (!JSON.parse(process.env.BOT_DEBUG)) {
                bot.guilds.cache
                    .get(config.debug_info.debug_server)
                    .channels.cache.get(config.debug_info.debug_channel)
                    .send({
                        embeds: [Message],
                    });
            }
        } catch (err) {}
    });

    if (!JSON.parse(process.env.BOT_DEBUG))
        log.info('------------BOT SUCCESSFULLY STARTED------------', new Date());
});

bot.login(process.env.BOT_TOKEN);

//! ERROR --
process.on('unhandledRejection', (err) => {
    if (JSON.parse(process.env.BOT_DEBUG)) return console.log(err);
    else errorhandler({ err, fatal: true });

    errorhandler({ err: `---- BOT RESTARTED..., ${new Date()}`, fatal: false });
    spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ['ignore', null, null],
    }).unref();
    process.exit();
});

process.on('uncaughtException', (err) => {
    if (JSON.parse(process.env.BOT_DEBUG)) return console.log(err);
    else errorhandler({ err, fatal: true });

    errorhandler({ err: `---- BOT RESTARTED..., ${new Date()}`, fatal: false });
    spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ['ignore', null, null],
    }).unref();
    process.exit();
});
