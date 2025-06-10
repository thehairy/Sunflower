const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    // Load slash commands
    const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));
    
    for (const file of slashCommandFiles) {
        const command = require(`../commands/slash/${file}`);
        if (command.data && command.execute) {
            client.slashCommands.set(command.data.name, command);
            console.log(`Loaded slash command: ${command.data.name}`);
        }
    }    // Load prefix commands
    const prefixCommandFiles = fs.readdirSync('./commands/prefix').filter(file => file.endsWith('.js'));
    
    for (const file of prefixCommandFiles) {
        const command = require(`../commands/prefix/${file}`);
        if (command.name && command.execute) {
            client.prefixCommands.set(command.name, command);
            console.log(`Loaded prefix command: ${command.name}`);
        }
    }
};
