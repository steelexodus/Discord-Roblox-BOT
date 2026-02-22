require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Discord bot setup
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const PORT = process.env.PORT || 6995;

// Discord ready
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Discord message commands
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const args = message.content.split(' ');
    const command = args.shift().toLowerCase();

    if (command === '!roblox') {
        const username = args[0] || 'Unknown';
        message.channel.send(`Roblox username: ${username}`);
    }

    if (command === '!ping') {
        message.channel.send('Pong!');
    }
});

// Express endpoint for Roblox
app.post('/notify', async (req, res) => {
    const { playerName, action } = req.body;
    if (!playerName || !action) return res.status(400).send('Missing data');

    try {
        const channel = await client.channels.fetch(CHANNEL_ID);
        channel.send(`Player **${playerName}** has performed: **${action}**`);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error sending Discord message');
    }
});

// Start Discord bot
client.login(DISCORD_TOKEN);

// Start Express server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
