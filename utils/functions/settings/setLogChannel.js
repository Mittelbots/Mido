const Config = require('../../class/Config/Config');
const { updateLogChannel } = require('../updateData/updateLogChannel');

module.exports.setLogChannel = async ({ main_interaction, newLogChannel }) => {
    return new Promise(async (resolve, reject) => {
        if (newLogChannel) {
            const config = await new Config()
                .get(main_interaction.guild.id)
                .then((config) => {
                    return config;
                })
                .catch((err) => {
                    reject(err);
                });

            if (config.log_channel === newLogChannel.id) {
                reject('Already set');
                return false;
            }
        }

        return await updateLogChannel({
            guild_id: main_interaction.guild.id,
            newLogChannel: newLogChannel ? newLogChannel.id : null,
        });
    });
};
