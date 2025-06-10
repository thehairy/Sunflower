const { SlashCommandBuilder, PermissionsBitField, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong! and shows bot latency')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
    
    async execute(interaction) {
        try {
            const sent = await interaction.reply({ 
                content: 'Pinging...', 
                withResponse: true ,
                flags: MessageFlags.Ephemeral
            });
            
            const latency = sent.resource.message.createdTimestamp - interaction.createdTimestamp;
            const apiLatency = Math.round(interaction.client.ws.ping);
            
            await interaction.editReply({
                content: `🏓 Pong!\n📡 **Latency:** ${latency}ms\n💓 **API Latency:** ${apiLatency}ms`
            });
        } catch (error) {
            console.error('Error executing ping command:', error);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};
