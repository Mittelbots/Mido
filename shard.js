const { ShardingManager } = require('discord.js');
require('dotenv').config();

let manager = new ShardingManager('./index.js', {
    token: process.env.BOT_TOKEN,
    totalShards: 'auto',
    respawn: true,
});

manager.on('shardCreate', (shard) => {
    console.log(`[SHARDS]: Launched shards ${shard.id}`);
});

manager.spawn();
