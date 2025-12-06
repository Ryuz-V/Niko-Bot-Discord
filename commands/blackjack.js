const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function drawCard() {
    const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const card = cards[Math.floor(Math.random() * cards.length)];
    let value = 0;

    if (card === 'A') value = 11;
    else if (['J', 'Q', 'K'].includes(card)) value = 10;
    else value = parseInt(card);

    return { card, value };
}

function calculateHand(hand) {
    let total = hand.reduce((a, c) => a + c.value, 0);
    let aces = hand.filter(c => c.card === 'A').length;

    while (total > 21 && aces > 0) {
        total -= 10; 
        aces--;
    }

    return total;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play Blackjack Game With Niko!'),

    async execute(interaction) {
        let playerHand = [drawCard(), drawCard()];
        let dealerHand = [drawCard(), drawCard()];

        const hitBtn = new ButtonBuilder()
            .setCustomId('hit')
            .setLabel('Hit')
            .setStyle(ButtonStyle.Primary);

        const standBtn = new ButtonBuilder()
            .setCustomId('stand')
            .setLabel('Stand')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(hitBtn, standBtn);

        const getBoard = () => {
            return {
                content:
                    `**Blackjack** \n\n` +
                    `**Kamu:** ${playerHand.map(c => c.card).join(', ')} (Total: ${calculateHand(playerHand)})\n` +
                    `**Niko:** ${dealerHand[0].card}, ❓`,
                components: [row]
            };
        };

        await interaction.reply(getBoard());

        const collector = interaction.channel.createMessageComponentCollector({
            time: 60000
        });

        collector.on('collect', async btn => {
            if (btn.user.id !== interaction.user.id)
                return btn.reply({ content: 'Ini bukan game kamu!', ephemeral: true });

            if (btn.customId === 'hit') {
                playerHand.push(drawCard());

                if (calculateHand(playerHand) > 21) {
                    collector.stop('bust');
                    return btn.update({
                        content:
                            `**Kamu bust!** \n` +
                            `Kartu kamu: ${playerHand.map(c => c.card).join(', ')} (Total: ${calculateHand(playerHand)})\n\n` +
                            `Niko Menang!`,
                        components: []
                    });
                }

                return btn.update(getBoard());
            }

            if (btn.customId === 'stand') {
                collector.stop('stand');

                let dealerTotal = calculateHand(dealerHand);
                while (dealerTotal < 17) {
                    dealerHand.push(drawCard());
                    dealerTotal = calculateHand(dealerHand);
                }

                let playerTotal = calculateHand(playerHand);

                let result = '';

                if (dealerTotal > 21 || playerTotal > dealerTotal) {
                    result = '**Kamu menang! **';
                } else if (playerTotal < dealerTotal) {
                    result = '**Niko menang! **';
                } else {
                    result = '**Seri! **';
                }

                return btn.update({
                    content:
                        `**Game selesai!**\n\n` +
                        `**Kamu:** ${playerHand.map(c => c.card).join(', ')} (Total: ${playerTotal})\n` +
                        `**Niko:** ${dealerHand.map(c => c.card).join(', ')} (Total: ${dealerTotal})\n\n` +
                        result,
                    components: []
                });
            }
        });
    }
};
