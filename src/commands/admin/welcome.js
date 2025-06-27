/**
 * Welcome command - Toggle welcome message for new members
 */
async function welcomeCommand(context) {
    const { messageService, welcomeManager, from, msg, args, groupName } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, "*Kirim Format*\n\nwelcome on\nwelcome off", msg);
        }
        
        const welcome = welcomeManager.getWelcomeDb();
        const isWelcome = welcomeManager.isWelcomeEnabled(from, welcome);
        
        if (args[0].toLowerCase() === "on") {
            if (isWelcome) {
                return await messageService.reply(from, "Sudah aktif✓", msg);
            }
            
            welcomeManager.enableWelcome(from, welcome);
            await messageService.reply(from, "Suksess mengaktifkan welcome di group:\n" + groupName, msg);
            
        } else if (args[0].toLowerCase() === "off") {
            if (!isWelcome) {
                return await messageService.reply(from, "Welcome belum aktif", msg);
            }
            
            welcomeManager.disableWelcome(from, welcome);
            await messageService.reply(from, "Success menonaktifkan welcome di group:\n" + groupName, msg);
            
        } else {
            await messageService.reply(from, "Kata kunci tidak ditemukan!", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'welcome', msg);
    }
}

export default welcomeCommand; 