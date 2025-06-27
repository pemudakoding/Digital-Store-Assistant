/**
 * AFK Stats command - View AFK statistics across all groups (Owner only)
 */
export default async function afkStatsCommand(context) {
    const { messageService, afkManager, from, msg, args, isOwner } = context;
    
    try {
        // Check if user is owner
        if (!isOwner) {
            return await messageService.reply(from,
                "❌ Command ini hanya untuk owner bot!",
                msg
            );
        }
        
        const allAfkData = afkManager.getDbAfk();
        
        if (allAfkData.length === 0) {
            return await messageService.reply(from,
                "✅ Tidak ada admin yang sedang AFK di semua grup!\n_Semua admin aktif_ 🤖",
                msg
            );
        }
        
        // If specific user mentioned, show their stats
        if (args[0]) {
            const targetUserId = args[0].replace('@', '') + '@s.whatsapp.net';
            const userStats = afkManager.getUserAfkStats(targetUserId);
            
            if (userStats.totalGroups === 0) {
                return await messageService.reply(from,
                    `📊 *AFK STATS - USER SPECIFIC*\n\n❌ User tersebut tidak sedang AFK di grup manapun.`,
                    msg
                );
            }
            
            let message = `📊 *AFK STATS - USER SPECIFIC*\n\n`;
            message += `👤 *User ID:* ${targetUserId}\n`;
            message += `📈 *Total Groups AFK:* ${userStats.totalGroups}\n\n`;
            
            userStats.groups.forEach((group, index) => {
                message += `${index + 1}. *Group:* ${group.groupJid}\n`;
                message += `   💭 *Alasan:* ${group.reason}\n`;
                message += `   ⏰ *Durasi:* ${group.duration}\n\n`;
            });
            
            return await messageService.reply(from, message, msg);
        }
        
        // Group AFK data by groups
        const groupedData = {};
        allAfkData.forEach(user => {
            if (!groupedData[user.groupJid]) {
                groupedData[user.groupJid] = [];
            }
            groupedData[user.groupJid].push(user);
        });
        
        let message = `📊 *AFK STATISTICS - ALL GROUPS*\n\n`;
        message += `📈 *Total AFK Users:* ${allAfkData.length}\n`;
        message += `🏢 *Groups with AFK:* ${Object.keys(groupedData).length}\n\n`;
        
        Object.entries(groupedData).forEach(([groupJid, users], index) => {
            message += `${index + 1}. *Group:* ${groupJid}\n`;
            message += `   👥 *AFK Count:* ${users.length}\n`;
            
            users.forEach(user => {
                const duration = afkManager.calculateDuration(user.timeStamp);
                message += `   • *${user.pushname}* - ${user.reason} (${duration})\n`;
            });
            
            message += `\n`;
        });
        
        message += `💡 *Tip:* Gunakan \`afkstats @user\` untuk melihat stats user tertentu`;
        
        await messageService.reply(from, message, msg);
        
    } catch (error) {
        console.error('AFK Stats Command Error:', error);
        await messageService.reply(from,
            "❌ Terjadi kesalahan saat mengambil statistik AFK!",
            msg
        );
    }
} 