const { ButtonBuilder, ActionRowBuilder, EmbedBuilder  } = require("discord.js")
const secret_config = require('../../../_secret/secret_config/secret_config.json');

module.exports.welcome_message = async (member) => {
    if(member.guild.id === '914934447349059645') { //! ONLY ON HAUTNAH.
        const newWelcomeMessage = new EmbedBuilder()
            .setTitle(`Willkommen auf ${member.guild.name}!`)
            .setDescription('Um dem Meeting zu joinen drücke auf "Meeting beitreten"')
            .setThumbnail(member.guild.iconURL())
            .setColor('#e8d475')
            .setTimestamp()

        const button =  new ButtonBuilder()
            .setURL(secret_config.welcome_msg_link)
            .setLabel('Meeting beitreten')
            .setStyle('LINK')

        await member.send({
            embeds: [newWelcomeMessage],
            components: [new ActionRowBuilder({
                components: [button]
            })]
        });
    }
}