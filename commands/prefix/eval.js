const Discord = require('discord.js');
const db = require('../../database/init');

module.exports = {
    name: 'eval',
    description: 'Evaluates JavaScript code (Owner only)',
    aliases: ['evaluate', 'exec'],
    
    async execute(message, args) {
        // Check if user is authorized (only user ID: 211888560662511617)
        if (!args.length || message.author.id !== '211888560662511617') {
            return;
        }

        // Join all arguments to form the code
        const code = args.join(' ');
        
        try {
            // Make Discord library, database, and message object available in eval context
            const discord = Discord;
            const database = db;
            const msg = message;
            const client = message.client;
            
            // Evaluate the code
            let evaled = eval(code);
            
            // Handle promises
            if (evaled instanceof Promise) {
                evaled = await evaled;
            }
            
            // Convert result to string
            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, { depth: 0 });
            }
            
            // Limit output length to prevent spam
            if (evaled.length > 1900) {
                evaled = evaled.substring(0, 1900) + '...';
            }
            
            // Send result in code block
            await message.reply(`\`\`\`js\n${evaled}\n\`\`\``);
            
        } catch (error) {
            console.error('Eval command error:', error);
            await message.reply(`❌ **Error:**\n\`\`\`js\n${error.message}\n\`\`\``);
        }
    },
};
