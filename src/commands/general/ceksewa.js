/**
 * Ceksewa command - Check rental status
 */
export default async function ceksewaCommand(context) {
    const { messageService, sewaManager, from, msg, isGroup } = context;
    
    try {
        if (!isGroup) {
            return await messageService.reply(from, "Perintah ini hanya bisa digunakan di grup!", msg);
        }

        const db_sewa = sewaManager.getSewaDb();
        
        if (sewaManager.checkSewaGroup(from, db_sewa)) {
            const expired = sewaManager.getSewaExpired(from, db_sewa);
            const remaining = sewaManager.getRemainingTime(from, db_sewa);
            const formattedTime = sewaManager.formatRemainingTime(remaining);
            
            const response = `✅ *STATUS SEWA GRUP*\n\n` +
                `📊 *Status:* Aktif\n` +
                `⏰ *Sisa Waktu:* ${formattedTime}\n` +
                `📅 *Expired:* ${expired === "PERMANENT" ? "Unlimited" : new Date(expired).toLocaleString()}\n\n` +
                `💡 *Info:* Hubungi owner untuk perpanjang sewa`;
                
            await messageService.reply(from, response, msg);
        } else {
            await messageService.reply(from, "Grup ini tidak disewakan", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'ceksewa', msg);
    }
} 