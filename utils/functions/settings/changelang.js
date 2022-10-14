const { getLang } = require('../getData/getLang');
const { updateLang } = require('../updateData/updateLang');

module.exports.changeLang = async ({ main_interaction, language }) => {
    const currentLang = await getLang(main_interaction.guild.id);

    if (currentLang === language) {
        const lang = require(`../../assets/json/language/${currentLang}.json`);
        return {
            error: true,
            message: lang.settings.lang.already_exists,
        };
    } else {
        return await updateLang({
            guild_id: main_interaction.guild.id,
            language: language.toLowerCase(),
        });
    }
};
