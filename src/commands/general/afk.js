/**
 * AFK command - Set user as Away From Keyboard for current group
 * Only for group admins
 */
export default async function afkCommand(context) {
    const { messageService, afkManager, from, msg, fullArgs, sender, pushname, isGroup, isGroupAdmin, groupName } = context;
    
    try {
        // Check if in group
        if (!isGroup) {
            return await messageService.reply(from, 
                "❌ Command AFK hanya bisa digunakan di grup!", 
                msg
            );
        }
        
        // Check if user is admin
        if (!isGroupAdmin) {
            return await messageService.reply(from,
                "❌ Command AFK hanya untuk admin grup!",
                msg
            );
        }
        
        // Check if user is already AFK in this group
        const existingAfk = afkManager.getAfkUser(sender, from);
        if (existingAfk) {
            return await messageService.reply(from,
                `⚠️ *${pushname}*, kamu sudah AFK di grup ini!\n💭 *Alasan sebelumnya:* ${existingAfk.reason}\n\n_Kirim pesan apa saja untuk kembali dari AFK_`,
                msg
            );
        }
        
        // Get reason or use default
        const reason = fullArgs || "Tidak ada alasan";
        
        // Add to AFK list for this group
        afkManager.addAfk(reason, sender, pushname, from);
        
        // Create AFK confirmation message
        const afkMessages = [
            `🌙 *${pushname}* sekarang sedang AFK di grup *${groupName}*\n💭 *Alasan:* ${reason}\n\n_Bot akan memberitahu yang mention/reply kamu di grup ini! 🤖_`,
            `😴 *${pushname}* telah pergi sementara dari *${groupName}*...\n💬 *Alasan:* ${reason}\n\n_Jangan lupa kembali ya! 👋_`,
            `🚶‍♂️ *${pushname}* sedang menghilang dari *${groupName}*\n📝 *Alasan:* ${reason}\n\n_Sampai jumpa lagi! ✨_`,
            `🎭 *${pushname}* masuk mode ninja di *${groupName}*\n🎯 *Alasan:* ${reason}\n\n_See you later, admin! 🥷_`,
            `🌸 *${pushname}* sedang berkelana dari *${groupName}*...\n🗯️ *Alasan:* ${reason}\n\n_Selamat jalan, admin! 🌟_`
        ];
        
        const selectedMessage = afkMessages[Math.floor(Math.random() * afkMessages.length)];
        
        await messageService.reply(from, selectedMessage, msg);
        
        // Log AFK status
        console.log(`AFK Set: ${pushname} (${sender}) in group ${groupName} - Reason: ${reason}`);
        
    } catch (error) {
        console.error('AFK Command Error:', error);
        await messageService.reply(from,
            "❌ Terjadi kesalahan saat mengatur status AFK!",
            msg
        );
    }
} 