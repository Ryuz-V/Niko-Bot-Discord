const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Give someone a kiss')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User yang mau kamu kiss')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('target');

        // GIF biasa
        const gifs = [
            "https://i.pinimg.com/originals/37/63/3f/37633f0b8d39daf70a50f69293e303fc.gif",
            "https://i.pinimg.com/originals/6c/05/e5/6c05e58405258b50711b84ac9db7441a.gif",
            "https://i.pinimg.com/originals/7e/c2/74/7ec274aba59cd155c76f34db80ce7b0c.gif",
            "https://i.pinimg.com/originals/dd/75/74/dd75746bdc711509af2359a63c41e8c4.gif",
            "https://i.pinimg.com/originals/8d/bb/6c/8dbb6cabe86646281cc32a38be17d71e.gif",
        ];

        // GIF spesial
        const specialGifs = [
            "https://i.pinimg.com/originals/4b/7f/e1/4b7fe1b083630d016d2d4d5cf760cde6.gif",
        ];

        const isKissingBot =
            target.bot &&
            (target.username.toLowerCase() === "niko" || target.globalName?.toLowerCase() === "niko");

        if (isKissingBot) {
            const randomGif = specialGifs[Math.floor(Math.random() * specialGifs.length)];

            return interaction.reply({
                content: `**Bruh why you give me a kiss? **`,
                embeds: [
                    {
                        image: { url: randomGif },
                        color: 0xff0000
                    }
                ]
            });
        }

        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        await interaction.reply({
            content: `**${interaction.user} gives a kiss to ${target}**`,
            embeds: [
                {
                    image: { url: randomGif },
                    color: 0xff77c7
                }
            ]
        });
    }
};
