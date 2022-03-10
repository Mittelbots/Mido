const { MessageButton } = require("discord.js")
const { Message } = require("discord.js")
const { MessageActionRow } = require("discord.js")
const { MessageEmbed } = require("discord.js")


module.exports.welcome_message = async (member) => {
    const newWelcomeMessage = new MessageEmbed()
        .setTitle(`Willkommen auf ${member.guild.name}!`)
        .setDescription('Um dem Meeting zu joinen drücke auf "Meeting beitreten"')
        .setThumbnail(member.guild.iconURL())
        .setColor('#1a2a4c')
        .setTimestamp()

    const button =  new MessageButton()
        .setURL('https://npmjs.com/discord-buttons')
        .setLabel('Meeting beitreten')
        .setStyle('LINK')

    await member.send({
        embeds: [newWelcomeMessage],
        components: [new MessageActionRow({
            components: [button]
        })]
    });
}