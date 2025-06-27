/**
 * Cek AFK command - Check who is currently AFK in current group
 */
export default async function cekAfkCommand(context) {
    const { messageService, afkManager, from, msg, isGroup, groupName } = context;
    
    try {
        // Check if in group
        if (!isGroup) {
            return await messageService.reply(from, 
                "❌ Command ini hanya bisa digunakan di grup!", 
                msg
            );
        }
        
        // Get all AFK users for this group only
        const afkUsers = afkManager.getGroupAfkUsers(from);
        
        if (afkUsers.length === 0) {
            return await messageService.reply(from,
                `✅ Tidak ada admin yang sedang AFK di grup *${groupName}* saat ini!\n_Semua admin siap melayani_ 🤖`,
                msg
            );
        }
        
        // Create AFK list message
        let message = `🌙 *DAFTAR ADMIN AFK - ${groupName.toUpperCase()}*\n\n`;
        
        afkUsers.forEach((user, index) => {
            const duration = calculateAfkDuration(user.timeStamp);
            message += `${index + 1}. *${user.pushname}*\n`;
            message += `   💭 ${user.reason}\n`;
            message += `   ⏰ ${duration}\n\n`;
        });
        
        message += `_Total: ${afkUsers.length} admin sedang AFK di grup ini_\n`;
        message += `_Scope: Khusus grup ${groupName}_`;
        
        await messageService.reply(from, message, msg);
        
    } catch (error) {
        console.error('Cek AFK Command Error:', error);
        await messageService.reply(from,
            "❌ Terjadi kesalahan saat mengecek status AFK!",
            msg
        );
    }
}

/**
 * Calculate AFK duration in human readable format
 */
function calculateAfkDuration(timestamp) {
    const now = Date.now();
    const duration = now - timestamp;
    
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        const remainingHours = hours % 24;
        if (remainingHours > 0) {
            return `${days} hari ${remainingHours} jam`;
        }
        return `${days} hari`;
    } else if (hours > 0) {
        const remainingMinutes = minutes % 60;
        if (remainingMinutes > 0) {
            return `${hours} jam ${remainingMinutes} menit`;
        }
        return `${hours} jam`;
    } else if (minutes > 0) {
        return `${minutes} menit`;
    } else {
        return `${seconds} detik`;
    }
} 