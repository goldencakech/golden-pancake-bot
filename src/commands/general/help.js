const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Menampilkan bantuan dan daftar perintah bot'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('📖 Bantuan & Informasi Bot TCG')
            .setDescription('Selamat datang! Berikut adalah daftar command yang dapat Kamu gunakan:')
            .addFields(
                {
                    name: '🛒 `/shop`',
                    value: 'Buka katalog kartu TCG kustom. Kamu bisa melihat-lihat produk, mengisi nama, dan mendapatkan link menuju pembayaran di website.'
                },
                {
                    name: '❓ `/help`',
                    value: 'Menampilkan pesan bantuan ini.'
                }
            )
            .setFooter({ text: 'TCG Custom Shop Bot' })
            .setColor('#0099FF');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};