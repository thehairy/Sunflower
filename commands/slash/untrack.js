const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const database = require('../../database/init');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untrack')
        .setDescription('Remove a message from tracking and stop monitoring reactions')
        .addStringOption(option =>
            option.setName('message_id')
                .setDescription('The ID of the message to untrack')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
    
    async execute(interaction) {
        try {
            const messageId = interaction.options.getString('message_id');
            
            // Check if the message exists in the database
            const trackedMessage = await database.getTrackedMessage(messageId);
            
            if (!trackedMessage) {
                await interaction.reply({
                    content: `❌ Message with ID \`${messageId}\` is not being tracked.`,
                    ephemeral: true
                });
                return;
            }
            
            // Remove the message from tracking
            const removedRows = await database.removeTrackedMessage(messageId);
            
            if (removedRows > 0) {
                // Try to get the message to show some context (optional, may fail if message is deleted)
                let messageInfo = '';
                try {
                    const channel = await interaction.client.channels.fetch(trackedMessage.channel_id);
                    if (channel) {
                        try {
                            const message = await channel.messages.fetch(messageId);
                            const messagePreview = message.content.length > 100 
                                ? message.content.substring(0, 100) + '...' 
                                : message.content;
                            messageInfo = `\n📝 **Message:** ${messagePreview}`;
                        } catch (fetchError) {
                            // Message might be deleted, that's okay
                            messageInfo = `\n📝 **Message:** *(Message may have been deleted)*`;
                        }
                    }
                } catch (channelError) {
                    // Channel might not be accessible, that's okay
                }
                
                await interaction.reply({
                    content: `✅ **Successfully untracked message**\n` +
                           `🆔 **Message ID:** \`${messageId}\`\n` +
                           `📍 **Channel:** <#${trackedMessage.channel_id}>\n` +
                           `👤 **Original Author:** <@${trackedMessage.user_id}>${messageInfo}\n\n` +
                           `This message will no longer trigger role assignments when reacted to.`,
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: `❌ Failed to untrack message with ID \`${messageId}\`. It may have already been removed.`,
                    ephemeral: true
                });
            }
            
        } catch (error) {
            console.error('Error executing untrack command:', error);
            
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ There was an error while executing this command!',
                    ephemeral: true
                });
            }
        }
    },
};
