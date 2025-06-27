/**
 * Unblock command - Unblock a previously blocked user
 */
async function unblockCommand(context) {
    const { ramz, messageService, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, 
                `Ex : unblock Nomor Yang Ingin Di Unblock\n\nContoh :\nunblock 628xxxx`, msg);
        }
        
        const nomorNya = fullArgs.trim();
        await ramz.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "unblock");
        
        await messageService.reply(from, "Sukses Unblock Nomor", msg);
        
    } catch (error) {
        await messageService.sendError(from, 'unblock', msg);
    }
}

export default unblockCommand; 