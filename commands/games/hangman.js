const { SlashCommandBuilder } = require('discord.js');

const categories = {
    benda: ["kursi", "meja", "komputer", "pintu", "mouse"],
    negara: ["indonesia", "jepang", "korea", "inggris", "malaysia"],
    "nama karakter film": ["harry", "thor", "ironman", "elsa", "joker"],
    "nama games": ["minecraft", "valorant", "fortnite", "genshin", "roblox"],
    "nama karakter umamusume": ["specialweek", "silencesuzuka", "tokaiTeio", "goldship"],
    hewan: ["kucing", "anjing", "burung", "sapi", "gajah"]
};

const games = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Start the Hangman game!')
        .addStringOption(opt =>
            opt.setName('category')
                .setDescription('Pick a category game!')
                .setRequired(true)
                .addChoices(
                    { name: 'Object', value: 'benda' },
                    { name: 'Country', value: 'negara' },
                    { name: 'Movie character name', value: 'nama karakter film' },
                    { name: 'Games Name', value: 'nama games' },
                    { name: 'Umamusume character name', value: 'nama karakter umamusume' },
                    { name: 'Animal', value: 'hewan' }
                )
        ),

    async execute(interaction) {
        const kategori = interaction.options.getString('category');

        if (games.has(interaction.channelId)) {
            return interaction.reply("❗ Masih ada game berjalan di channel ini!");
        }

        const listKata = categories[kategori];
        const word = listKata[Math.floor(Math.random() * listKata.length)].toLowerCase();
        const display = Array(word.length).fill("_");

        // Simpan game
        games.set(interaction.channelId, {
            word,
            display,
            tries: 6,
            guessed: [],
            kategori
        });

        await interaction.reply(
            `**Hangman Begins!**\nKategori: **${kategori}**\n` +
            `Guess the letter using **/guess \<huruf\>**\n\n` +
            `Word: \`${display.join(" ")}\`\n` +
            `Remaining Life: **6** ❤️`
        );
    }
};

// Export map biar bisa dipakai guess.js
module.exports.games = games;
