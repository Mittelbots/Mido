const {
    SlashCommandBuilder
} = require('@discordjs/builders');
const { getLang } = require('../../../utils/functions/getData/getLang');


const { changeLang } = require('../../../utils/functions/settings/changelang');
const { setLogChannel } = require('../../../utils/functions/settings/setLogChannel');

module.exports.run = async ({
    main_interaction,
    bot
}) => {

    const lang = require(`../../../utils/assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    let response;

    switch(main_interaction.options.getSubcommand()) {
        case 'changelang':
            response = await changeLang({
                main_interaction: main_interaction,
                language: main_interaction.options.getString('language')
            })

        case 'setlogchannel': 
            response = await setLogChannel({
                main_interaction: main_interaction,
                newLogChannel: main_interaction.options.getChannel('logchannel')
            })

        case 'removelogchannel': 
            response = await setLogChannel({
                main_interaction: main_interaction,
                newLogChannel: null
            })

            if(!response.error) {
                response.message = lang.settings.logChannel.removed
            }
    }


    if(response.error) {
        main_interaction.reply({
            content: response.message,
            ephemeral: true
        })
    }else {
        main_interaction.reply({
            content: response.message,
            ephemeral: true
        });
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
                