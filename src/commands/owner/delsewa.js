/**
 * Delete sewa command - Remove group from rental system
 */
export default async function delSewaCommand(context) {
    const { messageService, sewaManager, from, msg, isGroup, groupName } = context;
    
    try {
        // Check if command is used in a group
        if (!isGroup) {
            return await messageService.reply(from,
                "❌ *Command ini hanya bisa digunakan di grup!*\n\n" +
                "Gunakan command ini di grup yang ingin dibatalkan sewanya.",
                msg
            );
        }

        const db_sewa = sewaManager.getSewaDb();
        const groupJid = from;
        
        // Check if group exists in rental system
        if (!sewaManager.checkSewaGroup(groupJid, db_sewa)) {
            return await messageService.reply(from, 
                `❌ *Grup ini tidak terdaftar dalam sistem sewa!*\n\n` +
                `📱 *Grup:* ${groupName}\n` +
                `🆔 *ID:* ${groupJid}\n\n` +
                `Gunakan command \`listsewa\` untuk melihat daftar grup yang disewa.`, msg);
        }

        // Get rental info before deletion
        const remainingTime = sewaManager.getRemainingTime(groupJid, db_sewa);
        const expiredTime = sewaManager.getSewaExpired(groupJid, db_sewa);
        
        // Remove from rental system
        sewaManager.removeSewaGroup(groupJid, db_sewa);
        
        // Format remaining time info
        let timeInfo = "";
        if (remainingTime === "PERMANENT") {
            timeInfo = "♾️ *Sisa Waktu:* Unlimited";
        } else if (remainingTime > 0) {
            timeInfo = `⏰ *Sisa Waktu:* ${sewaManager.formatRemainingTime(remainingTime)}`;
        } else {
            timeInfo = "⏰ *Status:* Sudah Expired";
        }
        
        await messageService.reply(from, 
            `✅ *Sewa berhasil dibatalkan!*\n\n` +
            `📱 *Grup:* ${groupName}\n` +
            `🆔 *Group ID:* ${groupJid}\n` +
            `${timeInfo}\n` +
            `📅 *Dibatalkan:* ${new Date().toLocaleString('id-ID')}\n\n` +
            `🏁 Bot akan tetap aktif di grup ini sampai owner memutuskan untuk keluar.\n\n` +
            `💡 *Note:* Untuk menyewa lagi, silahkan hubungi owner`, msg);
        
    } catch (error) {
        console.error('Delete sewa command error:', error);
        await messageService.reply(from,
            "❌ *Gagal membatalkan sewa!*\n\n" +
            "Terjadi kesalahan sistem. Silakan coba lagi atau hubungi owner.",
            msg
        );
    }
} 