const { Events } = require('discord.js');
const database = require('../database/init');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        // Ignore bot messages
        if (message.author.bot) return;
        
        // Check for target phrase and add to database if found
        const targetPhrase = process.env.TARGET_PHRASE || 'keyword to track';
        const targetEmoji = process.env.TARGET_EMOJI || '✅';
        const targetChannelId = process.env.TARGET_CHANNEL_ID;

        const otherPhrases = process.env.OTHER_PHRASES ? process.env.OTHER_PHRASES.split(',').map(phrase => phrase.trim().toLowerCase()) : [];
        
        if (message.content.toLowerCase().includes(targetPhrase.toLowerCase())) {
            try {
                // React with the target emoji
                await message.react(targetEmoji);

                if (message.channel.id === targetChannelId) {
                    // Add message to database for tracking
                    await database.addTrackedMessage(
                        message.id,
                        message.channel.id,
                        message.author.id,
                        message.content
                    );
                    console.log(`Tracked message from ${message.author.tag} containing phrase: "${targetPhrase}"`);
                }
            } catch (error) {
                console.error('Error tracking message:', error);
            }

            return;
        }

        // Check for other phrases
        if (otherPhrases.length > 0) {
            for (const phrase of otherPhrases) {
                if (message.content.toLowerCase().includes(phrase)) {
                    try {
                        await message.react(targetEmoji);
                    } catch (error) {
                        console.error('Error reacting to message:', error);
                    }
                }
            }
        }
        
        // Handle prefix commands
        const prefix = process.env.PREFIX || '!';
        if (!message.content.startsWith(prefix)) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = message.client.prefixCommands.get(commandName);
        if (!command) return;
        
        try {
            await command.execute(message, args);
        } catch (error) {
            console.error('Error executing prefix command:', error);
            await message.reply('There was an error while executing this command!');
        }
    }
};
