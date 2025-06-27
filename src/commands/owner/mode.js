/**
 * Mode command - Switch bot mode on/off
 */
async function modeCommand(context) {
    const { messageService, from, msg, args, isOwner, fromMe } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, 
                `Kirim perintah mode _options_\nOptions : on & off\nContoh : mode on`, msg);
        }
        
        if (args[0].toLowerCase() === "off") {
            if (!fromMe && !isOwner) return;
            await messageService.reply(from, "Sukses mode Off", msg);
        } else if (args[0].toLowerCase() === "on") {
            await messageService.reply(from, "Sukses mode ON", msg);
        } else {
            await messageService.reply(from, "Kata kunci tidak ditemukan!", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'mode', msg);
    }
}

export default modeCommand; 