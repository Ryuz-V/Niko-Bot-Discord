const { SlashCommandBuilder } = require('discord.js');

const categories = {
    benda: ["kursi", "meja", "komputer", "pintu", "mouse"],
    negara: ["indonesia", "jepang", "korea", "inggris", "malaysia"],
    "nama karakter film": ["harry", "thor", "ironman", "elsa", "joker"],
    "nama games": ["minecraft", "valorant", "fortnite", "genshin", "roblox"],
    "nama karakter umamusume": ["specialweek", "silencesuzuka", "tokaiTeio", "goldship"],
    hewan: ["kucing", "anjing", "burung", "sapi", "gajah"]
};

// Game storage
const games = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hangman')
        .setDescription('Mulai game Hangman dengan kategori!')
        .addStringOption(opt =>
            opt.setName('kategori')
                .setDescription('Pilih kategori kata')
                .setRequired(true)
                .addChoices(
                    { name: 'Benda', value: 'benda' },
                    { name: 'Negara', value: 'negara' },
                    { name: 'Nama karakter film', value: 'nama karakter film' },
                    { name: 'Nama games', value: 'nama games' },
                    { name: 'Nama karakter Umamusume', value: 'nama karakter umamusume' },
                    { name: 'Hewan', value: 'hewan' }
                )
        ),

    async execute(interaction) {
        const kategori = interaction.options.getString('kategori');

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
            `🎮 **HANGMAN DIMULAI!**\nKategori: **${kategori}**\n` +
            `Tebak huruf dengan **/guess \<huruf\>**\n\n` +
            `Kata: \`${display.join(" ")}\`\n` +
            `Sisa nyawa: **6** ❤️`
        );
    }
};

// Export map biar bisa dipakai guess.js
module.exports.games = games;
