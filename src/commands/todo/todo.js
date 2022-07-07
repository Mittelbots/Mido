module.exports.run = async (bot, message, args) => {
    return message.reply('Dieser command ist zu einem Slash command konvertiert worden. Bitte nutze /todo').catch(err => {})
}

module.exports.help = {
    name: "todo",
    description: "todo [ID/@mention]",
    usage: "todo"
}