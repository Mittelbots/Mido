const database = require("../../../bot/db/db");
const { getLang } = require('../../../utils/functions/getData/getLang');

module.exports.getArchive = async (channel) => {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`);

    return await database.query(`SELECT * FROM todo WHERE guild = ? AND state = ?`, [channel.guild.id, 3])
		.then(async res => {
		
			res = await res;
			if(res.length === 0) {
				return false;
			}
			
			return res;
			
		})
		.catch(err => {
			//errorhandler(err, null, channel);
			return false;
		})
}