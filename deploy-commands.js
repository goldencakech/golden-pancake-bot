const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const commands = [];

// 1. Ambil semua folder command di dalam src/commands
const foldersPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
            console.log(`[INFO] Berhasil memuat command: ${command.data.name}`);
        } else {
            console.log(`[WARNING] Command di ${filePath} tidak memiliki properti "data" atau "execute".`);
        }
    }
}

// 2. Inisialisasi REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// 3. Fungsi Pendaftaran Command ke Discord API
(async () => {
    try {
        console.log(`\nSedang mendaftarkan ${commands.length} application (/) commands...`);

        // Pilihan A: Register Secara GLOBAL (Berlaku di semua Server tempat Bot berada, butuh waktu hingga 1 jam sync)
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        /* 
        // Pilihan B: Register Khusus ke SATU SERVER/GUILD (Instan untuk testing/development)
        // Jika ingin pakai ini, uncomment kode di bawah dan comment Pilihan A di atas.
        const data = await rest.put(
          Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
          { body: commands }
        );
        */

        console.log(`✅ Berhasil mendaftarkan ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('❌ Terjadi kesalahan saat mendaftarkan command:', error);
    }
})();