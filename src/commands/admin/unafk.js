/**
 * Unafk command - Remove AFK status for mentioned user in current group (Admin only)
 */
export default async function unafkCommand(context) {
    const { messageService, afkManager, from, msg, isGroup, isGroupAdmin, isOwner, quotedMsg, isQuotedMsg, groupName } = context;
    
    try {
        // Check if in group
        if (!isGroup) {
            return await messageService.reply(from, 
                "❌ Command ini hanya bisa digunakan di grup!", 
                msg
            );
        }
        
        // Check if user is admin or owner
        if (!isGroupAdmin && !isOwner) {
            return await messageService.reply(from,
                "❌ Command ini hanya untuk admin grup!",
                msg
            );
        }
        
        let targetUserId = null;
        let targetName = null;
        
        // Check if replying to someone
        if (isQuotedMsg && quotedMsg?.sender) {
            targetUserId = quotedMsg.sender;
            targetName = quotedMsg.pushName || 'User';
        } else {
            // Check for mentions
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentions.length > 0) {
                targetUserId = mentions[0]; // Take first mention
                // Try to get name from group metadata or use ID
                targetName = 'User'; // Will be updated from AFK data if available
            }
        }
        
        if (!targetUserId) {
            return await messageService.reply(from,
                "❌ Silakan reply pesan atau mention user yang ingin dihapus status AFK-nya!\n\n*Contoh:*\n- Reply pesan user + `unafk`\n- `unafk @username`",
                msg
            );
        }
        
        // Check if target user is AFK in this group
        const afkUser = afkManager.getAfkUser(targetUserId, from);
        if (!afkUser) {
            return await messageService.reply(from,
                `❌ User tersebut tidak sedang AFK di grup *${groupName}*!`,
                msg
            );
        }
        
        // Update target name from AFK data
        targetName = afkUser.pushname || targetName;
        
        // Remove AFK status for this group
        const removed = afkManager.removeAfk(targetUserId, from);
        
        if (removed) {
            const duration = calculateAfkDuration(afkUser.timeStamp);
            
            const messages = [
                `✅ *${targetName}* telah dihapus dari status AFK di grup *${groupName}*!\n💭 *Alasan sebelumnya:* ${afkUser.reason}\n⏰ *Durasi AFK:* ${duration}\n\n_Dipaksa balik sama admin! 😄_`,
                `🔄 *${targetName}* dikembalikan dari mode AFK di *${groupName}*\n📝 *Alasan tadi:* ${afkUser.reason}\n🕐 *Lama pergi:* ${duration}\n\n_Admin has spoken! 👮‍♂️_`,
                `🎯 Status AFK *${targetName}* berhasil dihapus dari grup *${groupName}*!\n💬 *Reason before:* ${afkUser.reason}\n⌚ *Duration:* ${duration}\n\n_Back to work! 💪_`
            ];
            
            const selectedMessage = messages[Math.floor(Math.random() * messages.length)];
            
            await messageService.reply(from, selectedMessage, msg);
            
            console.log(`UnAFK: ${targetName} (${targetUserId}) removed from AFK in group ${groupName} by admin`);
        } else {
            await messageService.reply(from,
                "❌ Gagal menghapus status AFK!",
                msg
            );
        }
        
    } catch (error) {
        console.error('UnAFK Command Error:', error);
        await messageService.reply(from,
            "❌ Terjadi kesalahan saat menghapus status AFK!",
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