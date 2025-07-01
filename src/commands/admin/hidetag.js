/**
 * Hidetag command - Tag all members without notification
 * 
 * Usage: hidetag [message]
 * Example: 
 *   hidetag Halo semua!
 *   Ini adalah pesan baris pertama
 *   Dan ini baris kedua
 * 
 * Features:
 * - Preserves line breaks in custom messages
 * - Supports multi-line messages for better readability
 * - Tags all group members without individual notifications
 * - Only forwards the message content without the command word
 */
async function hidetagCommand(context) {
    const { messageService, from, msg, body, groupMembers, isGroup, args } = context;
    
    try {
        // Check if this is a group
        if (!isGroup) {
            return await messageService.reply(from, 
                "❌ *Command ini hanya bisa digunakan di grup!*", msg);
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
        
        // Extract member IDs
        const memberIds = groupMembers.map((member) => member.id);
        
        // Extract message text - properly remove only the hidetag command
        let messageText = args.join(" ");
        
        // Use default message if no custom text provided or if text is empty after removing command
        if (!messageText || messageText.trim().length === 0) {
            messageText = "📢 *HIDETAG MESSAGE*\n\nHalo semua! 👋";
        }
        
        // Send message with mentions using MessageService
        await messageService.sendMentions(from, messageText, memberIds, { quoted: msg });
        
    } catch (error) {
        console.error('Hidetag command error:', error);
        await messageService.reply(from, 
            "❌ *Gagal mengirim hidetag!*\n\n" +
            "Kemungkinan penyebab:\n" +
            "• Bot bukan admin grup\n" +
            "• Koneksi bermasalah\n" +
            "• Error sistem\n\n" +
            "Coba lagi dalam beberapa saat.", msg);
    }
}

export default hidetagCommand; 