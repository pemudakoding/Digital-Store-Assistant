/**
 * Tagall command - Tag all group members
 */
async function tagallCommand(context) {
    const { messageService, from, msg, fullArgs, groupMembers, isGroup } = context;
    
    try {
        // Check if this is a group
        if (!isGroup) {
            return await messageService.reply(from, 
                "❌ *Command ini hanya bisa digunakan di grup!*", msg);
        }
        
        // Check if message text is provided
        if (!fullArgs || fullArgs.trim().length === 0) {
            return await messageService.reply(from, 
                "❌ *Format salah!*\n\n" +
                "Gunakan: `tagall <pesan>`\n" +
                "Contoh: `tagall Halo semua! Meeting dimulai sekarang`", msg);
        }
        
        // Check if groupMembers exists and is an array
        if (!groupMembers || !Array.isArray(groupMembers)) {
            return await messageService.reply(from, 
                "❌ *Gagal mendapatkan data member grup!*\n\nCoba lagi dalam beberapa saat.", msg);
        }
        
        // Check if there are members to tag
        if (groupMembers.length === 0) {
            return await messageService.reply(from, 
                "❌ *Tidak ada member yang bisa di-tag!*", msg);
        }
        
        // Build tag all message
        let teks_tagall = `══✪〘 *👥 TAG ALL* 〙✪══\n\n${fullArgs.trim()}\n\n`;
        
        // Add all members to the message
        for (let member of groupMembers) {
            const memberNumber = member.id.split("@")[0];
            teks_tagall += `➲ @${memberNumber}\n`;
        }
        
        teks_tagall += `\n📊 *Total Members:* ${groupMembers.length}`;
        
        // Extract member IDs for mentions
        const memberIds = groupMembers.map((member) => member.id);
        
        // Send message with mentions using MessageService
        await messageService.sendMentions(from, teks_tagall, memberIds, { quoted: msg });
        
    } catch (error) {
        console.error('Tagall command error:', error);
        await messageService.reply(from, 
            "❌ *Gagal mengirim tagall!*\n\n" +
            "Kemungkinan penyebab:\n" +
            "• Bot bukan admin grup\n" +
            "• Koneksi bermasalah\n" +
            "• Error sistem\n\n" +
            "Coba lagi dalam beberapa saat.", msg);
    }
}

export default tagallCommand; 