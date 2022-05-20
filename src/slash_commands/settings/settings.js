const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { errorhandler } = require('../../../utils/functions/errorhandler/errorhandler');
const {
    getLang
} = require('../../../utils/functions/getData/getLang');


const {
    changeLang
} = require('../../../utils/functions/settings/changelang');
const {
    setLogChannel
} = require('../../../utils/functions/settings/setLogChannel');
const { setPermissions } = require('../../../utils/functions/settings/setPermissions');

module.exports.run = async ({
    main_interaction,
    bot
}) => {
    const lang = require(`../../../utils/assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const hasPermission = await main_interaction.member.permissions.has('ADMINISTRATOR');
    if(!hasPermission) {
        return main_interaction.reply({
            content: lang.errors.noperms,
            ephemeral: true
        }).catch(err => {})
    }

    let response;

    switch (main_interaction.options.getSubcommand()) {
        case 'changelang':
            response = await changeLang({
                main_interaction: main_interaction,
                language: main_interaction.options.getString('language')
            })
            break;

        case 'setlogchannel':
            response = await setLogChannel({
                main_interaction: main_interaction,
                newLogChannel: main_interaction.options.getChannel('logchannel')
            })
            break;

        case 'removelogchannel':
            response = await setLogChannel({
                main_interaction: main_interaction,
                newLogChannel: null
            })

            if (!response.error) {
                response.message = lang.settings.logChannel.removed
            }
            break;

            case 'permissions':
                response = await setPermissions({
                    main_interaction: main_interaction,
                    permissions: {
                        role: main_interaction.options.getRole('role'),
                        viewtask: main_interaction.options.getBoolean('viewtask'),
                        addtask: main_interaction.options.getBoolean('addtask'),
                        edittask: main_interaction.options.getBoolean('edittask'),
                        addproject: main_interaction.options.getBoolean('addproject'),
                        deleteProject: main_interaction.options.getBoolean('deleteproject'),
                        view_user_archive: main_interaction.options.getBoolean('viewuserarchiv'),
                        view_guild_archive: main_interaction.options.getBoolean('viewguildarchiv'),
                        edit_guild_archive: main_interaction.options.getBoolean('editguildarchiv'),
                    }
                });
            break;
    }


    if (response.error) {
        errorhandler({err: response.error, message: `Error while LogChannelChange UserID: ${main_interaction.user.id}`, fatal: false})
        main_interaction.reply({
            content: response.message,
            ephemeral: true
        }).catch(err => {})
    } else {
        errorhandler({err: '', message: `${response.message} UserID ${main_interaction.user.id} | GuildID: ${main_interaction.guild.id}`, fatal: false});
        main_interaction.reply({
            content: response.message,
            ephemeral: true
        }).catch(err => {});
    }
}

module.exports.data = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('change the language of the bot')
    .addSubcommand(subcommand =>
        subcommand
        .setName('changelang')
        .setDescription('change the language of the bot')
        .addStringOption(option =>
            option.setName('language')
            .setDescription('Grab your preffered language')
            .setRequired(true)
            .addChoices({
                name: 'German',
                value: 'DE'
            })
            // .addChoices({
            //     name: 'English',
            //     value: 'EN'
            // })
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('setlogchannel')
        .setDescription('Set your Log Channel.')
        .addChannelOption(option =>
            option.setName('logchannel')
            .setDescription('Mention your preffered channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('removelogchannel')
        .setDescription('Remove your Log Channel.')
    )
    .addSubcommand(subcommand =>
        subcommand
        .setName('permissions')
        .setDescription('Set all permissions as you want it.')
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('Mention a role you want to give permissions to')
            .setRequired(true)
        )

        .addBooleanOption(option =>
            option.setName('viewtask')
            .setDescription('Does your role have the permission to view tasks?')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('addtask')
            .setDescription('Does your role have the permission to add tasks?')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('edittask')
            .setDescription('Does your role have the permission to edit tasks?')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('addproject')
            .setDescription('Does your role have the permission to add Projects?')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('deleteproject')
            .setDescription('Does your role have the permission to delete Projects?')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('viewuserarchiv')
            .setDescription('Does your role have the permission to view the personal Archive')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('viewguildarchiv')
            .setDescription('Does your role have the permission to view the Guild Archive')
            .setRequired(true)
        )
        .addBooleanOption(option =>
            option.setName('editguildarchiv')
            .setDescription('Does your role have the permission to edit the Guild Archive')
            .setRequired(true)
        )
    )