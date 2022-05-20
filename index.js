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
    spawn
} = require('child_process');
const {
    MessageEmbed
} = require("discord.js");
const { createSlashCommands } = require("./utils/functions/createSlashCommands/createSlashCommands");
const { handleSlashCommands } = require("./src/slash_commands");
const { guildCreate } = require("./bot/events/guildCreate");
const { db_backup } = require("./bot/db/db_backup");
const { isUserPremium } = require("./utils/functions/premium/premium");

//? JSON --
const token = require('./_secret/token.json');
const secret_config = require('./_secret/secret_config/secret_config.json');
const config = require('./utils/assets/json/_config/config.json');
const activity = require('./utils/assets/json/activity/activity.json');
const { startUpCache } = require("./utils/functions/cache/startUpCache");
const version = require('./package.json').version;

const bot = new Discord.Client({
    intents: 32767, // ALL INTENTS
    makeCache: Discord.Options.cacheWithLimits({
        MessageManager: 10,
        PresenceManager: 0,
        disableMentions: '@everyone, @here'
        // Add more class names here
    }),
});

bot.setMaxListeners(5);

bot.commands = new Discord.Collection();
deployCommands({
    bot: bot,
});
createSlashCommands();

bot.on('guildCreate', async (guild) => {
    return await guildCreate({guild: guild, bot: bot})
});

bot.on("messageCreate", message => {
    return messageCreate(message, bot);
});

bot.on('guildMemberAdd', async member => {
    return await welcome_message(member);
});

bot.once('ready', async function () {
    bot.guilds.cache.get(config.debug_info.debug_server).members.cache.get(config.Bot_Owner_ID).send(err);
    await startUpCache();

    if(!secret_config.debug) {
        db_backup();
        setTimeout(() => {
            db_backup();
        }, 86400000); // 24h
    }

    watchToDoList(bot);
    
    bot.on('interactionCreate', async (main_interaction) => {
        if(main_interaction.isCommand()) {
            const isPremium = await isUserPremium({user_id: main_interaction.user.id});

            if(isPremium.error) return main_interaction.reply({
                content: isPremium.message,
                ephemeral: true
            });

            handleSlashCommands({
                main_interaction: main_interaction,
                bot: bot,
                isPremium: isPremium.premium,
                isPlatin: isPremium.platin
            })
        }else {
            await main_interaction.deferUpdate();
            try {
                ProjectInteraction(main_interaction)
            } catch (err) {}
        }
    });
    getLinesOfCode((cb) => {
        var codeLines = ` | Lines of Code: ${cb}` || '';
        bot.user.setActivity({
            name: activity.playing.name + ' v' + version + codeLines,
            type: activity.playing.type
        });
    });

    console.info(`****Ready! Logged in as ${bot.user.tag}! I'm on ${bot.guilds.cache.size} Server****`, new Date());

    bot.on('debug', (debug) => {
        var Message = new MessageEmbed()
            .setDescription(`**Debug info: ** \n ${debug}`)

        try {
            if (!secret_config.debug) {
                bot.guilds.cache.get(config.debug_info.debug_server).channels.cache.get(config.debug_info.debug_channel).send({
                    embeds: [Message]
                });
            }
        } catch (err) {}
    });


    if (!secret_config.debug) log.info('------------BOT SUCCESSFULLY STARTED------------', new Date());
});

bot.login(token.BOT_TOKEN);

//! ERROR --
process.on('unhandledRejection', err => {
    if (secret_config.debug) console.log(err);
    else errorhandler({err, fatal: true});

    bot.guilds.cache.get(config.debug_info.debug_server).members.cache.get(config.Bot_Owner_ID).send(err).catch(err => {});

    errorhandler({err: `---- BOT RESTARTED..., ${new Date()}`, fatal: false});
    spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ['ignore', null, null]
    }).unref()
    process.exit()
});

process.on('uncaughtException', err => {
    if (secret_config.debug) console.log(err);
    else errorhandler({err, fatal: true});

    bot.guilds.cache.get(config.debug_info.debug_server).members.cache.get(config.Bot_Owner_ID).send(err).catch(err => {});

    errorhandler({err: `---- BOT RESTARTED..., ${new Date()}`, fatal: false});
    spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ['ignore', null, null]
    }).unref()
    process.exit()
});