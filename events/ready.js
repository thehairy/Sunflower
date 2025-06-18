const { Events, Collection } = require('discord.js');
const MusicManager = require('../musicManager');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        console.log(`Bot is running in ${client.guilds.cache.size} servers`);
        
        // Set bot status
        client.user.setActivity('🎵 Playing music 24/7', { type: 'LISTENING' });

        // Initialize music manager
        client.musicManager = new MusicManager();

        // Join voice channel and start playing music
        const guildId = process.env.GUILD_ID;
        const voiceChannelId = process.env.VOICE_CHANNEL_ID;

        if (guildId && voiceChannelId) {
            const guild = client.guilds.cache.get(guildId);
            if (guild) {
                await client.musicManager.joinChannel(guild, voiceChannelId);
            } else {
                console.error(`Guild ${guildId} not found`);
            }
        } else {
            console.error('GUILD_ID or VOICE_CHANNEL_ID not configured in .env file');
        }
    }
};
