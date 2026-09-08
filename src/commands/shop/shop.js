const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const cards = require('../../utils/cardData');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Menampilkan daftar kartu TCG yang tersedia di toko.'),

    async execute(interaction) {
        const currentIndex = 0;
        const card = cards[currentIndex];

        // Embed Tampilan Kartu
        const embed = new EmbedBuilder()
            .setTitle(card.name)
            .setDescription(card.description)
            .addFields({ name: 'Harga', value: card.price })
            .setImage(card.image)
            .setFooter({ text: `Kartu ${currentIndex + 1} dari ${cards.length}` })
            .setColor('#5865F2');

        // Membuat tombol Navigasi & Beli
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`prev_${currentIndex}`)
                .setLabel('◀ Previous')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true), // Tombol Previous dinonaktifkan pada kartu pertama
            new ButtonBuilder()
                .setCustomId(`buy_${card.id}`)
                .setLabel('🛒 Buy')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`next_${currentIndex}`)
                .setLabel('Next ▶')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(cards.length <= 1) // Tombol Next dinonaktifkan jika hanya ada satu kartu
        );

        await interaction.reply({ embeds: [embed], components: [row] });
    }
};