const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true, // Hanya dijalankan sekali saat bot pertama kali login
    execute(client) {
        console.log(`\n========================================`);
        console.log(`✅ Bot berhasil online sebagai: ${client.user.tag}`);
        console.log(`========================================\n`);

        // Mengatur status/aktivitas bot di Discord
        client.user.setActivity('Katalog Kartu TCG | /shop', {
            type: ActivityType.Watching
        });
    }
};