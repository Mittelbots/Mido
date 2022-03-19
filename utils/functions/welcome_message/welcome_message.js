const { MessageButton, MessageActionRow, MessageEmbed  } = require("discord.js")
const secret_config = require('../../../_secret/secret_config/secret_config.json');

module.exports.welcome_message = async (member) => {
    if(member.guild.id === '914934447349059645') { //! ONLY ON HAUTNAH.
        const newWelcomeMessage = new MessageEmbed()
            .setTitle(`Willkommen auf ${member.guild.name}!`)
            .setDescription('Um dem Meeting zu joinen drücke auf "Meeting beitreten"')
            .setThumbnail(member.guild.iconURL())
            .setColor('#e8d475')
            .setTimestamp()

        const button =  new MessageButton()
            .setURL(secret_config.welcome_msg_link)
            .setLabel('Meeting beitreten')
            .setStyle('LINK')

        await member.send({
            embeds: [newWelcomeMessage],
            components: [new MessageActionRow({
                components: [button]
            })]
        });
    }
}