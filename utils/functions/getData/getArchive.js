const database = require("../../../bot/db/db");
const { getLang } = require('../../../utils/functions/getData/getLang');
const { toDoState_Deleted } = require("../../variables/variables");

module.exports.getArchive = async ({channel}) => {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`);

    return await database.query(`SELECT * FROM mido_todo WHERE guild_id = ? AND state = ?`, [channel.guild.id, toDoState_Deleted])
		.then(async res => {
			res = await res;
			if(res.length === 0) {
				return false;
			}
			
			return res;
			
		})
		.catch(err => {
			//errorhandler(err, null, channel);
			console.log(err);
			return false;
		})
}