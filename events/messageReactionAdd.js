const { Events } = require('discord.js');
const database = require('../database/init');

module.exports = {
    name: Events.MessageReactionAdd,
    async execute(reaction, user) {
        // Ignore bot reactions
        if (user.bot) return;

        // Ensure the reaction is not partial, if it is, fetch it
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error('Failed to fetch reaction:', error);
                return;
            }
        }
          // Get configuration from environment variables
        const targetChannelId = process.env.TARGET_CHANNEL_ID;
        const targetEmoji = process.env.TARGET_EMOJI || '✅';
        const targetRoleId = process.env.TARGET_ROLE_ID;
        const newNickname = process.env.NEW_NICKNAME || 'Verified Member';
        const excludedRoleIds = process.env.EXCLUDED_ROLE_IDS ? process.env.EXCLUDED_ROLE_IDS.split(',').map(id => id.trim()) : [];
        
        // Check if reaction is in the target channel
        if (targetChannelId && reaction.message.channel.id !== targetChannelId) {
            return;
        }
        
        // Check if the correct emoji was used
        if (reaction.emoji.name !== targetEmoji && reaction.emoji.id !== targetEmoji) {
            return;
        }
        
        try {
            // Get the guild and member first to check for excluded roles
            const guild = reaction.message.guild;
            const member = await guild.members.fetch(user.id);
            
            if (!member) {
                console.error('Could not fetch member');
                return;
            }
            
            // Check if user has any excluded roles
            if (excludedRoleIds.length > 0) {
                const hasExcludedRole = member.roles.cache.some(role => excludedRoleIds.includes(role.id));
                if (hasExcludedRole) {
                    console.log(`User ${user.tag} has an excluded role, skipping reaction processing`);
                    return;
                }
            }
            
            // Query database to check if this message is being tracked
            const trackedMessage = await database.getTrackedMessage(reaction.message.id);
            
            if (!trackedMessage) {
                console.log(`Reaction on non-tracked message: ${reaction.message.id}`);
                return;
            }
            
            console.log(`Valid reaction found on tracked message by ${user.tag}`);
            
            // Set nickname if possible
            if (member.manageable) {
                try {
                    await member.setNickname(newNickname);
                    console.log(`Set nickname for ${user.tag} to "${newNickname}"`);
                } catch (error) {
                    console.error(`Failed to set nickname for ${user.tag}:`, error.message);
                }
            } else {
                console.log(`Cannot manage ${user.tag} - insufficient permissions`);
            }
            
            // Add role if specified
            try {
                if (!member.roles.cache.has(targetRoleId)) {
                    await member.roles.add(targetRoleId);
                    console.log(`Added role "${targetRoleId}" to ${user.username}`);
                } else {
                    console.log(`${user.username} already has the role "${targetRoleId}"`);
                }
            } catch (error) {
                console.error(`Failed to add role to ${user.tag}:`, error.message);
            }
        } catch (error) {
            console.error('Error in messageReactionAdd event:', error);
        }
    }
};
