const { Events, EmbedBuilder } = require('discord.js');
const { afkUsers } = require('../commands/afk.js');

module.exports = {
    name: Events.MessageCreate,

    async execute(message) {

        if (message.author.bot) return;

        const userId = message.author.id;

        // ================================
        // 1. WELCOME BACK
        // ================================
        if (afkUsers.has(userId)) {

            const data = afkUsers.get(userId);
            clearTimeout(data.timeout);
            afkUsers.delete(userId);

            return message.reply(`Welcome back, **${message.author.username}**! 👋`);
        }

        // ================================
        // 2. CHECK MENTIONS (robust)
        // ================================

        // Normal mention handler
        const mentionedUsers = new Set(message.mentions.users.map(u => u));

        // Regex untuk menangkap mention <@123> dan <@!123>
        const mentionRegex = /<@!?(\d+)>/g;
        let match;
        while ((match = mentionRegex.exec(message.content)) !== null) {
            const id = match[1];
            const user = await message.client.users.fetch(id).catch(() => null);
            if (user) mentionedUsers.add(user);
        }

        if (mentionedUsers.size < 1) return;

        // Loop semua user yg dimention
        for (const user of mentionedUsers) {

            if (!afkUsers.has(user.id)) continue;

            const data = afkUsers.get(user.id);

            const since = new Date(data.since).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "medium"
            });

            const embed = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle(`${user.username} is currently AFK`)
                .setDescription(data.message)
                .addFields({ name: "Since", value: since });

            message.reply({ embeds: [embed] });
        }
    }
};
