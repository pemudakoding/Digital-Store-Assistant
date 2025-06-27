/**
 * Add sewa command - Add group to rental system
 */
export default async function addSewaCommand(context) {
    const { messageService, sewaManager, from, msg, args, isGroup, groupName } = context;
    
    try {
        // Check if command is used in a group
        if (!isGroup) {
            return await messageService.reply(from,
                "❌ *Command ini hanya bisa digunakan di grup!*\n\n" +
                "Gunakan command ini di grup yang ingin disewakan.",
                msg
            );
        }
        
        if (args.length < 1) {
            return await messageService.reply(from,
                "❌ *Format salah!*\n\n" +
                "Format: `addsewa <durasi>`\n\n" +
                "Contoh:\n" +
                "• `addsewa 30d` - Sewa 30 hari\n" +
                "• `addsewa 7d` - Sewa 7 hari\n" +
                "• `addsewa 1m` - Sewa 1 bulan\n\n" +
                "📝 *Note:* Gunakan command ini di grup yang ingin disewakan",
                msg
            );
        }

        const durasi = args[0];
        
        // Validate duration format
        if (!durasi.match(/^\d+[dm]$/)) {
            return await messageService.reply(from,
                "❌ *Format durasi salah!*\n\n" +
                "Format yang benar:\n" +
                "• `30d` untuk 30 hari\n" +
                "• `1m` untuk 1 bulan\n" +
                "• `7d` untuk 7 hari\n\n" +
                "Gunakan 'd' untuk hari atau 'm' untuk bulan",
                msg
            );
        }

        const db_sewa = sewaManager.getSewaDb();
        
        // Use group JID directly from context
        const groupJid = from;
        
        // Check if group already exists in rental system
        if (sewaManager.checkSewaGroup(groupJid, db_sewa)) {
            return await messageService.reply(from, 
                `❌ *Bot sudah disewakan di grup ini!*\n\n` +
                `📱 *Grup:* ${groupName}\n` +
                `🆔 *ID:* ${groupJid}\n\n` +
                `Gunakan command \`ceksewa\` untuk melihat detail sewa.`, msg);
        }

        // Add to rental system using group JID
        sewaManager.addSewaGroup(groupJid, durasi, db_sewa);
        
        await messageService.reply(from, 
            `✅ *Bot berhasil disewakan!*\n\n` +
            `📱 *Grup:* ${groupName}\n` +
            `⏰ *Durasi:* ${durasi}\n` +
            `🆔 *Group ID:* ${groupJid}\n` +
            `📅 *Dimulai:* ${new Date().toLocaleString('id-ID')}\n\n` +
            `🎉 Selamat! Bot sudah aktif di grup ini.`, msg);
        
    } catch (error) {
        console.error('Add sewa command error:', error);
        await messageService.reply(from,
            "❌ *Gagal menambahkan sewa!*\n\n" +
            "Terjadi kesalahan sistem. Silakan coba lagi atau hubungi owner.",
            msg
        );
    }
} 