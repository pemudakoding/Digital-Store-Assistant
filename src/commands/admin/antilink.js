/**
 * Antilink command - Toggle anti-link protection with kick
 */
async function antilinkCommand(context) {
    const { messageService, antilinkManager, from, msg, args } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, 
                `Kirim perintah antilink _options_\nOptions : on & off\nContoh : antilink on`, msg);
        }
        
        const antilink = antilinkManager.getAntilinkDb();
        const isAntiLink = antilinkManager.isAntilinkEnabled(from, antilink);
        
        if (args[0].toLowerCase() === "on") {
            if (isAntiLink) {
                return await messageService.reply(from, "Antilink sudah aktif", msg);
            }
            
            antilinkManager.enableAntilink(from, antilink);
            await messageService.reply(from, "Successfully Activate Antilink In This Group", msg);
            
        } else if (args[0].toLowerCase() === "off") {
            if (!isAntiLink) {
                return await messageService.reply(from, "Antilink belum aktif", msg);
            }
            
            antilinkManager.disableAntilink(from, antilink);
            await messageService.reply(from, "Successfully Disabling Antilink In This Group", msg);
            
        } else {
            await messageService.reply(from, "Kata kunci tidak ditemukan!", msg);
        }
        
    } catch (error) {
        console.log(error)
        await messageService.sendError(from, 'antilink', msg);
    }
}

export default antilinkCommand; 