const { SlashCommandBuilder } = require('discord.js');
const hangmanFile = require('./hangman.js');
const games = hangmanFile.games;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess the letters in Hangman!')
        .addStringOption(opt =>
            opt.setName('letter')
                .setDescription('The letter to be guessed')
                .setRequired(true)
                .setMaxLength(1)
        ),

    async execute(interaction) {
        const game = games.get(interaction.channelId);
        const letter = interaction.options.getString('letter').toLowerCase();

        if (!game)
            return interaction.reply("No games yet! Start with **/hangman**");

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

        if (!game.display.includes("_")) {
            games.delete(interaction.channelId);
            return interaction.reply(
                ` **You Win!**\nKategori: **${game.kategori}**\nKata: \`${game.word}\``
            );
        }

        if (game.tries <= 0) {
            games.delete(interaction.channelId);
            return interaction.reply(
                `**You Lose!**\nKategori: **${game.kategori}**\nKata asli: \`${game.word}\``
            );
        }

        await interaction.reply(
            `🔤 Guess: **${letter}**\n` +
            `Category: **${game.kategori}**\n` +
            `Word: \`${game.display.join(" ")}\`\n` +
            `Remaining life: **${game.tries}** ❤️`
        );
    }
};
