const {  ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');

module.exports = {
    name: 'music',
    description: 'Shows the currently playing song and playlist',
    
    async execute(message, args) {
        const client = message.client;
        
        if (!client.musicManager) {
            return message.reply('❌ Music manager not initialized');
        }

        const currentTrack = client.musicManager.getCurrentTrack();
        const playlist = client.musicManager.getPlaylist();

        const container = new ContainerBuilder()
            .addTextDisplayComponents([
                new TextDisplayBuilder()
                    .setContent("**🎵 Currently Playing:**"),
                new TextDisplayBuilder()
                    .setContent(`${currentTrack}`),
            ])
            .addSeparatorComponents([
                new SeparatorBuilder()
            ])
            .addTextDisplayComponents([
                new TextDisplayBuilder()
                    .setContent(playlist)
            ])

        await message.reply({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
};
