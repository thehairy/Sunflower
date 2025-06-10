const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(`Bot is running in ${client.guilds.cache.size} servers`);
        
        // Set bot status
        client.user.setActivity('Monitoring messages', { type: 'WATCHING' });
    }
};
