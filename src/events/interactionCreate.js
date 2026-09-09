const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const cards = require('../utils/cardData');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // 1. Handle Slash Command
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Terjadi kesalahan saat menjalankan command.', ephemeral: true });
            }
        }

        // 2. Handle Tombol Navigasi & Buy
        if (interaction.isButton()) {
            const [action, id] = interaction.customId.split('_');

            // Navigasi Previous / Next
            if (action === 'prev' || action === 'next') {
                let newIndex = parseInt(id);
                if (action === 'prev') newIndex--;
                if (action === 'next') newIndex++;

                const card = cards[newIndex];

                const embed = new EmbedBuilder()
                    .setTitle(card.name)
                    .setDescription(card.description)
                    .addFields({ name: 'Harga', value: card.price })
                    .setImage(card.image)
                    .setFooter({ text: `Kartu ${newIndex + 1} dari ${cards.length}` })
                    .setColor('#5865F2');

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`prev_${newIndex}`)
                        .setLabel('◀ Previous')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(newIndex === 0),
                    new ButtonBuilder()
                        .setCustomId(`buy_${card.id}`)
                        .setLabel('🛒 Buy')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId(`next_${newIndex}`)
                        .setLabel('Next ▶')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(newIndex === cards.length - 1)
                );

                await interaction.update({ embeds: [embed], components: [row] });
            }

            // Klik Tombol Buy -> Munculkan Pop-up Input Nama (Modal)
            if (action === 'buy') {
                const modal = new ModalBuilder()
                    .setCustomId(`modal_checkout_${id}`)
                    .setTitle('Form Pemesanan Kartu');

                const nameInput = new TextInputBuilder()
                    .setCustomId('buyerName')
                    .setLabel('Masukkan Nama Lengkap Anda')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('Contoh: Budi Santoso')
                    .setRequired(true);

                const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
                modal.addComponents(firstActionRow);

                await interaction.showModal(modal);
            }
        }

        // 3. Handle Submit Form Modal -> Arahkan ke Website
        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith('modal_checkout_')) {
                const cardId = interaction.customId.replace('modal_checkout_', '');
                const buyerName = interaction.fields.getTextInputValue('buyerName');

                // 1. Cari data kartu berdasarkan cardId
                const card = cards.find(c => c.id === cardId);

                // 2. Format pesan WhatsApp
                const rawMessage = `Hi saya ${buyerName} ingin membeli kartu TCG ${card.name} dengan harga ${card.price}`;

                // 3. Encode pesan agar aman dibaca oleh browser/URL
                const waNumber = '6287887847086';
                const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

                // 4. Buat Embed Balasan
                const embed = new EmbedBuilder()
                    .setTitle('✅ Konfirmasi Pesanan WhatsApp')
                    .setDescription(`Halo **${buyerName}**, klik tombol di bawah untuk terhubung langsung ke WhatsApp kami.`)
                    .setColor('#25D366');

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Beli via WhatsApp Business')
                        .setURL(waUrl)
                        .setStyle(ButtonStyle.Link)
                );

                await interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
            }
        }
    }
};