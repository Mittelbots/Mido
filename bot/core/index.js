//? MODULES --
require('dotenv').config();

const { sentryInit } = require('./sentry');
sentryInit();

const { Client, EmbedBuilder, Options, GatewayIntentBits } = require('discord.js');
const { errorhandler } = require('../../utils/functions/errorhandler/errorhandler');
const { watchToDoList } = require('../../utils/functions/watchToDoList/watchToDoList');
const { spawn } = require('child_process');
const {
    createSlashCommands,
} = require('../../utils/functions/createSlashCommands/createSlashCommands');
const {
    guildScheduledEventCreate,
} = require('../../utils/functions/guildScheduledEvent/guildScheduledEvent');
const { setActivity } = require('../../utils/functions/activity/setActivity');
const { processErrorHandler } = require('../../utils/functions/errorhandler/processErrorHandler');

//? JSON --
const config = require('../../utils/assets/json/_config/config.json');
const { startBot } = require('./startup');
const { delay } = require('../../utils/functions/delay/delay');
const { acceptBotInteraction } = require('../events/_handle');
const Sentry = require("@sentry/node");
const { Partials } = require('discord.js');

processErrorHandler();

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
        GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

bot.setMaxListeners(0);

bot.version = process.env.npm_package_version;
bot.config = config;

createSlashCommands();

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
