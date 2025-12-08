const { SlashCommandBuilder } = require('discord.js');
const hangmanFile = require('./hangman.js');
const games = hangmanFile.games;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Tebak huruf Hangman!')
        .addStringOption(opt =>
            opt.setName('huruf')
                .setDescription('Huruf yang mau ditebak')
                .setRequired(true)
                .setMaxLength(1)
        ),

    async execute(interaction) {
        const game = games.get(interaction.channelId);
        const letter = interaction.options.getString('huruf').toLowerCase();

        if (!game)
            return interaction.reply("❗ Belum ada game! Mulai dengan **/hangman**");

        if (game.guessed.includes(letter))
            return interaction.reply("⚠ Huruf sudah pernah ditebak!");

        game.guessed.push(letter);

        if (game.word.includes(letter)) {
            for (let i = 0; i < game.word.length; i++) {
                if (game.word[i] === letter) game.display[i] = letter;
            }
        } else {
            game.tries--;
        }

        // Menang
        if (!game.display.includes("_")) {
            games.delete(interaction.channelId);
            return interaction.reply(
                `🎉 **MENANG!**\nKategori: **${game.kategori}**\nKata: \`${game.word}\``
            );
        }

        // Kalah
        if (game.tries <= 0) {
            games.delete(interaction.channelId);
            return interaction.reply(
                `💀 **KALAH!**\nKategori: **${game.kategori}**\nKata asli: \`${game.word}\``
            );
        }

        await interaction.reply(
            `🔤 Tebakan: **${letter}**\n` +
            `Kategori: **${game.kategori}**\n` +
            `Kata: \`${game.display.join(" ")}\`\n` +
            `Sisa nyawa: **${game.tries}** ❤️`
        );
    }
};
