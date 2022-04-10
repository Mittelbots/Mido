const config = require('./utils/assets/json/_config/config.json')
const {
    ShardingManager
} = require('discord.js')
const token = require('./_secret/token.json');

let manager = new ShardingManager('./index.js', {
    token: token.BOT_TOKEN,
    totalShards: "auto",
    respawn: true,
});

manager.on('shardCreate', shard => {
    console.log(`[SHARDS]: Launched shards ${shard.id}`)
});

manager.spawn();