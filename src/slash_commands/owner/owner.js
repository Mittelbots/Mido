const config = require('../../../utils/assets/json/_config/config.json');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { addUserPremium } = require('../../../utils/functions/premium/premium');
const { getLang } = require('../../../utils/functions/getData/getLang');

module.exports.run = async ({ main_interaction, bot }) => {
    const lang = require(`../../../utils/assets/json/language/${await getLang(
        main_interaction.guild.id
    )}.json`);

    await main_interaction.deferReply({ ephemeral: true });

    const hasPermission = main_interaction.user.id === config.Bot_Owner_ID;
    if (!hasPermission) {
        return main_interaction
            .followUp({
                content: lang.errors.noperms,
                ephemeral: true,
            })
            .catch((err) => {});
    }

    let response;

    switch (main_interaction.options.getSubcommand()) {
        case 'addpremium':
            if (
                main_interaction.options.getUser('user').bot ||
                main_interaction.options.getUser('user').system
            ) {
                response = {
                    error: true,
                    message: lang.premium.addPremium.no_bot,
                };
                break;
            } else {
                response = await addUserPremium({
                    user_id: main_interaction.options.getUser('user').id,
                    premium: main_interaction.options.getBoolean('premium'),
                    platin: main_interaction.options.getBoolean('platin'),
                });
            }

            if (response.error) {
                main_interaction
                    .followUp({
                        content: response.message,
                        ephemeral: true,
                    })
                    .catch((err) => {});
            } else {
                main_interaction
                    .followUp({
                        content: response.message,
                        ephemeral: true,
                    })
                    .catch((err) => {});
            }

            break;

        case 'export_logs':
            const type = main_interaction.options.getBoolean('type')
                ? '_logs/error'
                : '_debugLog/debug';

            const date = new Date();

            const year = date.getFullYear();
            const rawMonth = date.getMonth() + 1;
            const month = (rawMonth < 10 ? '0' : '') + rawMonth;
            const day = (date.getDate() < 10 ? '0' : '') + date.getDate();

            main_interaction
                .followUp({
                    files: [new AttachmentBuilder(`./${type}-${year}.${month}.${day}.log`)],
                })
                .catch((err) => {
                    return main_interaction
                        .followUp({
                            content: `Something went wrong ${err.toString()}`,
                            ephemeral: true,
                        })
                        .catch((err) => {});
                });
            break;
    }
};

module.exports.data = new SlashCommandBuilder()
    .setName('owner')
    .setDescription('Slash commands for the master')
    .setDefaultMemberPermissions('0')
    .addSubcommand((command) =>
        command
            .setName('addpremium')
            .setDescription('Add premium to a user')
            .addUserOption((option) =>
                option
                    .setName('user')
                    .setDescription('The user to add premium to')
                    .setRequired(true)
            )
            .addBooleanOption((option) =>
                option
                    .setName('premium')
                    .setDescription('Whether or not the user should be have premium')
                    .setRequired(true)
            )
            .addBooleanOption((option) =>
                option
                    .setName('platin')
                    .setDescription('Whether or not the user should be have platin')
                    .setRequired(true)
            )
    )
    .addSubcommand((command) =>
        command
            .setName('export_logs')
            .setDescription('Export the logs')
            .addBooleanOption((option) =>
                option
                    .setName('type')
                    .setDescription('Select if the error logs or the debug logs should be exported')
            )
    );
