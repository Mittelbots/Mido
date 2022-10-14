const { ButtonBuilder, ActionRowBuilder, EmbedBuilder  } = require("discord.js")

module.exports.welcome_message = async (member) => {
    if(member.guild.id === '914934447349059645') { //! ONLY ON HAUTNAH.
        const newWelcomeMessage = new EmbedBuilder()
            .setTitle(`Willkommen auf ${member.guild.name}!`)
            .setDescription('Um dem Meeting zu joinen drücke auf "Meeting beitreten"')
            .setThumbnail(member.guild.iconURL())
            .setColor('#e8d475')
            .setTimestamp()

        const button =  new ButtonBuilder()
            .setURL(process.env.DC_INVITE)
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