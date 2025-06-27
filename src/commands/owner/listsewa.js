/**
 * Listsewa command - List all rental groups
 */
export default async function listsewaCommand(context) {
    const { messageService, sewaManager, from, msg } = context;
    
    try {
        const sewa = sewaManager.getSewaDb();
        
        if (sewa.length === 0) {
            return await messageService.reply(from, "Tidak ada grup yang disewakan saat ini", msg);
        }

        let list_sewa_list = "*LIST SEWA GRUP*\n\n";
        
        for (let i = 0; i < sewa.length; i++) {
            const groupData = sewa[i];
            const remaining = sewaManager.getRemainingTime(groupData.id, sewa);
            const formattedTime = sewaManager.formatRemainingTime(remaining);
            
            list_sewa_list += `${i + 1}. Group ID: ${groupData.id}\n`;
            list_sewa_list += `   Status: ${remaining === "PERMANENT" ? "Unlimited" : (remaining > 0 ? "Active" : "Expired")}\n`;
            list_sewa_list += `   Sisa Waktu: ${formattedTime}\n\n`;
        }

        await messageService.reply(from, list_sewa_list, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'listsewa', msg);
    }
} 