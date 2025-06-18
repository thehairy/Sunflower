require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize client with required intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    partials: [
        Partials.Message,
        Partials.Reaction
    ]
});

// Initialize collections for commands
client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// Load handlers
const handlerFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
for (const file of handlerFiles) {
    require(`./handlers/${file}`)(client);
}

// Initialize database
const dbInit = require('./database/init');
dbInit.initializeDatabase();

// Login to Discord
client.login(process.env.DISCORD_TOKEN).catch(console.error);

module.exports = client;
