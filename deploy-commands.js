// deploy-commands.js
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // kalau kosong, daftarkan global (butuh waktu)

if (!token || !clientId) {
  console.error('Set BOT_TOKEN dan CLIENT_ID di .env dulu.');
  process.exit(1);
}

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) commands.push(command.data.toJSON());
  }
} else {
  console.log('Folder commands/ tidak ditemukan — buat beberapa file command dulu.');
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log(`Deploying ${commands.length} commands...`);
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log('Commands registered to guild (fast).');
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Commands registered globally (may take ~1 hour).');
    }
  } catch (err) {
    console.error(err);
  }
})();
