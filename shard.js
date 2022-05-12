const secret_config = require('./_secret/secret_config/secret_config.json');
const {
    ShardingManager
} = require('discord.js')
const token = require('./_secret/token.json');

let manager = new ShardingManager('./index.js', {
    token: token.BOT_TOKEN,
    totalShards: secret_config.totalShards,
    respawn: secret_config.respawn,
});

manager.on('shardCreate', shard => {
    console.log(`[SHARDS]: Launched shards ${shard.id}`)
});

manager.spawn();