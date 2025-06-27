/**
 * Broadcast command - Send message to all groups/contacts
 */
async function broadcastCommand(context) {
    const { messageService, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            const usage = "*Cara penggunaan:*\n";
            usage += "#broadcast <pesan>\n\n";
            usage += "*Contoh:*\n";
            usage += "#broadcast Promo hari ini! Diskon 50% untuk semua produk!";
            
            return await messageService.reply(from, usage, msg);
        }

        // Get all chats (simplified version)
        const chats = Object.keys(store.chats).filter(jid => 
            jid.endsWith('@g.us') || jid.endsWith('@s.whatsapp.net')
        );

        let successCount = 0;
        let failCount = 0;

        await messageService.reply(from, `🔄 Memulai broadcast ke ${chats.length} chat...`, msg);

        for (const chatId of chats) {
            try {
                await messageService.sendText(chatId, `📢 *BROADCAST*\n\n${fullArgs}`);
                successCount++;
                
                // Add delay to prevent spam
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                failCount++;
            }
        }

        const resultText = `✅ *Broadcast selesai!*\n\n`;
        resultText += `📤 Berhasil: ${successCount}\n`;
        resultText += `❌ Gagal: ${failCount}\n`;
        resultText += `📊 Total: ${chats.length}`;

        await messageService.reply(from, resultText, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default broadcastCommand; 