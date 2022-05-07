const database = require("../../../bot/db/db");
const { getLang } = require('../../../utils/functions/getData/getLang');
const { toDoState_Deleted } = require("../../variables/variables");
const config = require('../../assets/json/_config/config.json');

module.exports.getArchive = async ({channel, isGuildArchive, user_id}) => {
    const lang = require(`../../assets/json/language/${await getLang(channel.guild.id)}.json`);
	console.log(`SELECT * FROM ${config.tables.mido_todo} WHERE guild_id = ? AND state = ? ${(!isGuildArchive) ? 'AND user_id = ?' : ''}`)
    return await database.query(`SELECT * FROM ${config.tables.mido_todo} WHERE guild_id = ? AND state = ? ${(!isGuildArchive) ? 'AND user_id = ?' : ''}`, [channel.guild.id, toDoState_Deleted, (!isGuildArchive) ? user_id : ''])
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