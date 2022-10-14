const { getConfig } = require('../getData/getConfig');
const { getLang } = require('../getData/getLang');
const { updateLogChannel } = require('../updateData/updateLogChannel');

module.exports.setLogChannel = async ({ main_interaction, newLogChannel }) => {
    const lang = require(`../../assets/json/language/${await getLang(
        main_interaction.guild.id
    )}.json`);

    if (newLogChannel) {
        const currentLogChannel = await getConfig({
            guild_id: main_interaction.guild.id,
        });

        if (currentLogChannel.error) return currentLogChannel;
        else if (currentLogChannel.data.log_channel === newLogChannel.id) {
            return {
                error: true,
                message: lang.settings.logChannel.already_exists,
            };
        }
    }

    return await updateLogChannel({
        guild_id: main_interaction.guild.id,
        newLogChannel: newLogChannel ? newLogChannel.id : null,
    });
};
