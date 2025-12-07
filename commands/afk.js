const { SlashCommandBuilder } = require('discord.js');

const afkUsers = new Map();

module.exports = {
    afkUsers,

    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Set AFK status')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Pesan AFK kamu')
                .setRequired(false)
        ),

    async execute(interaction) {
        const msg = interaction.options.getString('message') || "I'm AFK right now.";
        const userId = interaction.user.id;

        afkUsers.set(userId, {
            message: msg,
            since: Date.now(),
            timeout: setTimeout(async () => {
                afkUsers.delete(userId);

                try {
                    await interaction.user.send(
                        `**You must have fallen asleep, ${interaction.user.username}.**  
Don't worry, I'll turn off this AFK for you.\nSleep well, ${interaction.user.username}.  
I hope you have sweet dreams. 🌙`
                    );
                } catch (err) {
                    console.log("DM gagal dikirim.");
                }
            }, 24 * 60 * 60 * 1000) // 24 hours
        });

        await interaction.reply(`Alright, I'll let them know.`);
    }
};
