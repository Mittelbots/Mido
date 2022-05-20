const config = require('../../../utils/assets/json/_config/config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { addUserPremium } = require('../../../utils/functions/premium/premium');
const { getLang } = require('../../../utils/functions/getData/getLang');

module.exports.run = async ({main_interaction, bot}) => {
	const lang = require(`../../../utils/assets/json/language/${await getLang(main_interaction.guild.id)}.json`);

    const hasPermission = main_interaction.user.id === config.Bot_Owner_ID;
    if(!hasPermission) {
        return main_interaction.reply({
            content: lang.errors.noperms,
            ephemeral: true
        }).catch(err => {})
    }

	let response;

	switch (main_interaction.options.getSubcommand()) {
		case 'addpremium':
			if(main_interaction.options.getUser('user').bot || main_interaction.options.getUser('user').system) {
				response = {
					error: true,
					message: lang.premium.addPremium.no_bot
				}
				break;
			}else {
				response = await addUserPremium({
					user_id: main_interaction.options.getUser('user').id,
					premium: main_interaction.options.getBoolean('premium'),
					platin: main_interaction.options.getBoolean('platin')
				})
			}
		break;
	}

	if (response.error) {
        main_interaction.reply({
            content: response.message,
            ephemeral: true
        }).catch(err => {})
    } else {
        main_interaction.reply({
            content: response.message,
            ephemeral: true
        }).catch(err => {});
    }

}

module.exports.data = new SlashCommandBuilder()
	.setName('owner')
	.setDescription('Slash commands for the master')
	.setDefaultPermission(false)
	.addSubcommand(command => 
		command.setName('addpremium')
		.setDescription('Add premium to a user')
		.addUserOption(option =>
			option.setName('user')
			.setDescription('The user to add premium to')
			.setRequired(true)
		)
		.addBooleanOption(option =>
			option.setName('premium')
			.setDescription('Whether or not the user should be have premium')	
			.setRequired(true)
		)
		.addBooleanOption(option =>
			option.setName('platin')
			.setDescription('Whether or not the user should be have platin')	
			.setRequired(true)
		)

	)
