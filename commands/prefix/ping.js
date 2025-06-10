module.exports = {
    name: 'ping',
    description: 'Replies with Pong! and shows bot latency',
    aliases: ['pong', 'latency'],
    
    async execute(message, args) {
        try {
            const sent = await message.reply('Pinging...');
            
            const latency = sent.createdTimestamp - message.createdTimestamp;
            const apiLatency = Math.round(message.client.ws.ping);
            
            await sent.edit(`🏓 Pong!\n📡 **Latency:** ${latency}ms\n💓 **API Latency:** ${apiLatency}ms`);
        } catch (error) {
            console.error('Error executing ping command:', error);
            await message.reply('There was an error while executing this command!');
        }
    },
};
