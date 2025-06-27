/**
 * Antilink2 command - Toggle anti-link protection without kick
 */
async function antilink2Command(context) {
    const { messageService, antilinkManager, from, msg, args } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, 
                `Kirim perintah antilink2 _options_\nOptions : on & off\nContoh : antilink2 on`, msg);
        }
        
        const antilink2 = antilinkManager.getAntilink2Db();
        const isAntiLink2 = antilinkManager.isAntilinkEnabled(from, antilink2);
        
        if (args[0].toLowerCase() === "on") {
            if (isAntiLink2) {
                return await messageService.reply(from, "Antilink 2 sudah aktif", msg);
            }
            
            antilinkManager.enableAntilink2(from, antilink2);
            await messageService.reply(from, "Successfully Activate Antilink 2 In This Group", msg);
            
        } else if (args[0].toLowerCase() === "off") {
            if (!isAntiLink2) {
                return await messageService.reply(from, "Antilink 2 belum aktif", msg);
            }
            
            antilinkManager.disableAntilink2(from, antilink2);
            await messageService.reply(from, "Successfully Disabling Antilink 2 In This Group", msg);
            
        } else {
            await messageService.reply(from, "Kata kunci tidak ditemukan!", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'antilink2', msg);
    }
}

export default antilink2Command; 