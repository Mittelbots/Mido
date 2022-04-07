//? MODULES --
const Discord = require("discord.js");
const {
    errorhandler
} = require("./utils/functions/errorhandler/errorhandler");
const {
    deployCommands
} = require("./utils/functions/deployCommands/deployCommands");
const {
    messageCreate
} = require("./bot/events/messageCreate");
const {
    getLinesOfCode
} = require("./utils/functions/getLinesOfCode/getLinesOfCode");
const {
    log
} = require("./logs");
const {
    welcome_message
} = require("./utils/functions/welcome_message/welcome_message");
const {
    ProjectInteraction
} = require("./utils/functions/toDoList/ProjectInteraction");
const {
    watchToDoList
} = require("./utils/functions/watchToDoList/watchToDoList");
const {
    getLang
} = require("./utils/functions/getData/getLang");
const {
    exec
} = require('child_process');

//? JSON --
const token = require('./_secret/token.json');
const config = require('./utils/assets/json/_config/config.json');
const activity = require('./utils/assets/json/activity/activity.json');
const {
    MessageEmbed
} = require("discord.js");
const version = require('./package.json').version;

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_VOICE_STATES"],
    makeCache: Discord.Options.cacheWithLimits({
        MessageManager: 10,
        PresenceManager: 0,
        disableMentions: '@everyone, @here'
        // Add more class names here
    }),
});

bot.setMaxListeners(5);

bot.commands = new Discord.Collection();
deployCommands(bot);

bot.on("messageCreate", message => {
    return messageCreate(message, bot);
});

bot.on('guildMemberAdd', async member => {
    return await welcome_message(member);
});

bot.once('ready', async () => {
    watchToDoList(bot);

    bot.on('interactionCreate', async (main_interaction) => {
        await main_interaction.deferUpdate();
        try {
            ProjectInteraction(main_interaction)
        } catch (err) {}
    });
    getLinesOfCode((cb) => {
        setTimeout(() => {
            var codeLines = ` | Lines of Code: ${cb}` || '';
            bot.user.setActivity({
                name: activity.playing.name + ' v' + version + codeLines,
                type: activity.playing.type
            });
        }, 10000);
    });

    console.info(`****Ready! Logged in as ${bot.user.tag}! I'm on ${bot.guilds.cache.size} Server****`, new Date());

    bot.on('debug', (debug) => {
        var Message = new MessageEmbed()
            .setDescription(`**Debug info: ** \n ${debug}`)
			  .addField('tst', 'tet')
    
        try {
            if(!config.debug) {
                bot.guilds.cache.get(config.debug_info.debug_server).channels.cache.get(config.debug_info.debug_channel).send({
                    embeds: [Message]
                });
            }
        } catch (err) {}
    });


    if (!config.debug) log.info('------------BOT SUCCESSFULLY STARTED------------', new Date());
});

bot.login(token.BOT_TOKEN);


//! ERROR --
process.on('unhandledRejection', err => {
    exec('npm run restart');
    if (config.debug) console.log(err);
    else return errorhandler(err, null, null)
});

process.on('uncaughtException', err => {
    exec('npm run restart');
    if (config.debug) console.log(err);
    else return errorhandler(err, null, null)
});