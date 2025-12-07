const { SlashCommandBuilder } = require('discord.js');

// GANTI DENGAN ID BOT NIKO
const NIKO_BOT_ID = "123456789012345678"; 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('Give someone a gentle pat')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('User yang mau kamu pat')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('target');

        // GIF PAT
        const gifs = [
            "https://i.pinimg.com/originals/36/04/27/3604278f5faba113671a93412540bd47.gif",
            "https://i.pinimg.com/originals/27/da/ce/27dace4b6aec7de261ddb5d9444e716a.gif",
            "https://i.pinimg.com/originals/75/9a/3e/759a3e4200a0f4c292ebf3fd84cf25e1.gif",
            "https://i.pinimg.com/originals/bb/23/82/bb2382f5f6a13612e8085f0d6fff22f1.gif",
            "https://i.pinimg.com/originals/77/97/b8/7797b8b9b5c8024cd30c6b103c42ec50.gif",
        ];

        // GIF SPESIAL
        const specialGifs = [
            "https://i.pinimg.com/originals/4b/7f/e1/4b7fe1b083630d016d2d4d5cf760cde6.gif",
        ];

        if (target.id === "1431956299872211057") {
            const special = specialGifs[Math.floor(Math.random() * specialGifs.length)];

            return interaction.reply({
                content: `**Don't pat me.** `,
                embeds: [
                    {
                        image: { url: special },
                        color: 0xff0000
                    }
                ]
            });
        }

        // PAT NORMAL
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        await interaction.reply({
            content: `**${interaction.user} gives a pat to ${target} **`,
            embeds: [
                {
                    image: { url: randomGif },
                    color: 0x55aaff
                }
            ]
        });
    }
};
