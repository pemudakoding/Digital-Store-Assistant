/**
 * Kick command - Remove member from group
 */
async function kickCommand(context) {
    const { groupService, messageService, from, msg, args } = context;
    
    try {
        // Extract mentioned users or quoted message
        let targetUser = null;
        
        // Check if there's a mentioned user in the message
        if (context.msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            targetUser = context.msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check if replying to someone
        else if (context.quotedMsg) {
            targetUser = context.quotedMsg.sender;
        }
        // Check if user provided phone number as argument
        else if (args[0]) {
            const phoneNumber = args[0].replace(/[^0-9]/g, '');
            if (phoneNumber.length >= 10) {
                targetUser = phoneNumber + '@s.whatsapp.net';
            }
        }
        
        if (!targetUser) {
            return await messageService.reply(from, 
                `❌ *Format Salah!*\n\n` +
                `Gunakan salah satu cara berikut:\n` +
                `• Tag orang yang ingin dikick: kick @user\n` +
                `• Reply pesan orang yang ingin dikick\n` +
                `• Ketik nomor: kick 628123456789`, msg);
        }
        
        // Use GroupService to remove participant (with queue)
        await groupService.removeParticipant(from, targetUser);
        
        const userNumber = targetUser.split('@')[0];
        const successMessage = `✅ *Berhasil mengeluarkan member!*\n\n` +
            `👤 *User:* @${userNumber}\n` +
            `📅 *Waktu:* ${new Date().toLocaleString('id-ID')}\n\n` +
            `_Member telah dikeluarkan dari grup_`;
            
        // Send message with mention
        await messageService.sendMentions(from, successMessage, [targetUser], { quoted: msg });
        
    } catch (error) {
        console.error('Kick command error:', error);
        await messageService.reply(from, 
            `❌ *Gagal mengeluarkan member!*\n\n` +
            `Kemungkinan penyebab:\n` +
            `• Bot bukan admin grup\n` +
            `• Target adalah admin grup\n` +
            `• User sudah tidak ada di grup\n` +
            `• Koneksi bermasalah`, msg);
    }
}

export default kickCommand; 