// index.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');

const token = process.env.BOT_TOKEN;
if (!token) {
  console.error('BOT_TOKEN belum di .env');
  process.exit(1);
}

// Inisialisasi client; kita fokus pada slash commands (tidak pakai message content)
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

// load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
    }
  }
}

client.once('ready', () => {
  console.log(`${client.user.tag} siap!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Terjadi error saat menjalankan command.', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Terjadi error saat menjalankan command.', ephemeral: true });
    }
  }
});

client.login(token);
