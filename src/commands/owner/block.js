/**
 * Block command - Block a user from using the bot
 */
async function blockCommand(context) {
    const { ramz, messageService, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, 
                `Ex : block Nomor Yang Ingin Di Block\n\nContoh :\nblock 628xxxx`, msg);
        }
        
        const nomorNya = fullArgs.trim();
        await ramz.updateBlockStatus(`${nomorNya}@s.whatsapp.net`, "block");
        
        await messageService.reply(from, "Sukses Block Nomor", msg);
        
    } catch (error) {
        await messageService.sendError(from, 'block', msg);
    }
}

export default blockCommand; 