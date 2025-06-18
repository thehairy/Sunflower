const { SlashCommandBuilder, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Shows the currently playing song and playlist'),
    
    async execute(interaction) {
        const client = interaction.client;
        
        if (!client.musicManager) {
            return interaction.reply('❌ Music manager not initialized');
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

        await interaction.reply({ flags: MessageFlags.IsComponentsV2, components: [container] });
    }
};
