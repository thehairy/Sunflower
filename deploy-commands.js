require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const slashCommandsPath = path.join(__dirname, 'commands', 'slash');
const commandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
    const filePath = path.join(slashCommandsPath, file);
    const command = require(filePath);
    if (command.data) {
        commands.push(command.data.toJSON());
        console.log(`Loaded command: ${command.data.name}`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error('Error deploying commands:', error);
    }
})();
