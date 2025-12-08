const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slot')
        .setDescription('Spin the slot machine and see how lucky you are!'),

    async execute(interaction) {
        const items = ["🍒", "🍋", "🔔", "💎", "🍇", "7️⃣"];
        
        const slot1 = items[Math.floor(Math.random() * items.length)];
        const slot2 = items[Math.floor(Math.random() * items.length)];
        const slot3 = items[Math.floor(Math.random() * items.length)];

        const result = `${slot1} | ${slot2} | ${slot3}`;

        let message = "Well, no luck this time. Try again!";
        if (slot1 === slot2 && slot2 === slot3) {
            message = "JACKPOT!! You're so lucky!";
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            message = "Not bad! Almost won.";
        }

        await interaction.reply(`🎰 **777 Niko Gacor** 🎰\n${result}\n\n${message}`);
    }
}
