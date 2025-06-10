# Discord Bot - Sunflower

A comprehensive Discord bot built with Node.js and discord.js v14.19.1, featuring command handlers, event handlers, SQLite database integration, and automated role management.

## Features

- **Dual Command System**: Supports both slash commands (/) and prefix commands (!)
- **Event Handling**: Ready, interaction, message, and reaction events
- **Message Tracking**: Automatically tracks messages containing specific phrases
- **Database Integration**: SQLite database for persistent message tracking
- **Role Management**: Automatic role assignment and nickname setting based on reactions
- **Emoji Reactions**: Automatic emoji reactions to tracked messages

## Project Structure

```
├── index.js                 # Main bot file
├── deploy-commands.js       # Slash command deployment script
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
├── commands/
│   ├── slash/             # Slash command files
│   └── prefix/            # Prefix command files
├── events/                # Event handler files
├── handlers/              # Command and event handlers
├── database/              # Database initialization and management
└── .github/
    └── copilot-instructions.md  # Copilot configuration
```

## Setup Instructions

### Quick Setup (Recommended)

Run the automated setup script to install dependencies and configure your bot:

**For Unix/Linux/macOS/Git Bash:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows Command Prompt:**
```cmd
setup.bat
```

The setup script will:
- Check for Node.js and npm installation
- Install all required dependencies
- Guide you through creating the `.env` file with interactive prompts
- Initialize the SQLite database
- Provide next steps for deployment

### Manual Setup

If you prefer to set up manually:

#### 1. Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your Discord bot configuration:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

# Bot Configuration
PREFIX=!
TARGET_PHRASE=keyword to track
TARGET_EMOJI=✅
TARGET_CHANNEL_ID=your_channel_id_here
TARGET_ROLE_ID=your_role_id_here
NEW_NICKNAME=Verified Member
```

#### 2. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and bot
3. Copy the bot token to your `.env` file
4. Enable the following bot permissions:
   - Send Messages
   - Use Slash Commands
   - Add Reactions
   - Manage Nicknames
   - Manage Roles
   - Read Message History

#### 3. Installation

```bash
# Install dependencies
npm install

# Deploy slash commands
npm run deploy

# Start the bot
npm start
```

## Commands

### Slash Commands
- `/ping` - Check bot latency and response time
- `/tracked` - View all tracked messages (requires Manage Messages permission)

### Prefix Commands
- `!ping` - Check bot latency and response time
- `!status` - Show bot status and statistics

## How It Works

### Message Tracking
1. Bot monitors all messages for the configured `TARGET_PHRASE`
2. When found, the message is saved to SQLite database
3. Bot automatically reacts with the `TARGET_EMOJI`

### Role Assignment
1. Bot monitors reactions in the specified `TARGET_CHANNEL_ID`
2. When `TARGET_EMOJI` is added to a tracked message:
   - Sets user's nickname to `NEW_NICKNAME`
   - Assigns the `TARGET_ROLE_ID` role
   - Logs the action to console

### Database Schema

```sql
CREATE TABLE tracked_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT UNIQUE NOT NULL,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Adding New Commands

**Slash Command:**
```javascript
// commands/slash/example.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('example')
        .setDescription('Example command'),
    async execute(interaction) {
        await interaction.reply('Hello World!');
    }
};
```

**Prefix Command:**
```javascript
// commands/prefix/example.js
module.exports = {
    name: 'example',
    description: 'Example command',
    async execute(message, args, client) {
        await message.reply('Hello World!');
    }
};
```

### Adding New Events

```javascript
// events/example.js
const { Events } = require('discord.js');

module.exports = {
    name: Events.EventName,
    once: false, // or true for one-time events
    async execute(...args, client) {
        // Event logic here
    }
};
```

## Scripts

- `npm start` - Start the bot
- `npm run dev` - Start the bot in development mode
- `npm run deploy` - Deploy slash commands to Discord

## Dependencies

- **discord.js**: ^14.19.1 - Discord API wrapper
- **sqlite3**: ^5.1.7 - SQLite database driver
- **dotenv**: ^16.5.0 - Environment variable management

## Troubleshooting

### Common Issues

1. **Bot not responding to commands**: Check bot permissions and token
2. **Database errors**: Ensure write permissions in project directory
3. **Role assignment fails**: Verify bot has higher role than target role
4. **Slash commands not appearing**: Run `npm run deploy` and wait up to 1 hour

### Logs

The bot provides detailed console logging for:
- Command loading and execution
- Message tracking events
- Role assignment actions
- Database operations
- Error handling

## License

ISC
