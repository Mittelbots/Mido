const database = require("../../../bot/db/db");
const { getFromCache, updateCache } = require("../cache/cache");
const config = require('../../assets/json/_config/config.json');

module.exports.getIgnoreMode = async () => {
    const ignoreModeCache = await getFromCache({
        cacheName: "global",
        param_id: "ignoreMode"
    });

    if(ignoreModeCache) return {
        error: false,
        ignoreMode: ignoreModeCache[0].ignoreMode
    }

    return await database.query(`SELECT ignoreMode FROM ${config.tables.mido_global} WHERE id = 1`)
        .then(async res => {
            await updateCache({
                cacheName: "global",
                param_id: "ignoreMode",
                updateVal: {
                    ignoreMode: (res.length === 0 || !res[0].ignoreMode) ? false : true
                }
            })
            
            return {
                error: false,
                ignoreMode: (res.length === 0 || !res[0].ignoreMode) ? false : true
            }

        })
        .catch(err => {
            errorhandler({err, fatal: true});
            return {
                error: true,
                message: "Error while fetching ignore mode"
            };
        })
}