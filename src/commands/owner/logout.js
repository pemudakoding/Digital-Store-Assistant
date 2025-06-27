/**
 * Logout command - Force logout and destroy session
 * Use this only when you want to completely reset the bot session
 */
async function logoutCommand(context) {
    const { messageService, from, msg, client } = context;
    
    try {
        await messageService.reply(from, 
            "🚪 Logging out and destroying session...\n\n⚠️ You will need to scan QR code again on next startup.", msg);
        
        // Give time for message to be sent
        setTimeout(async () => {
            try {
                await client.logout();
                process.exit(0);
            } catch (error) {
                console.error('Error during logout:', error);
                process.exit(1);
            }
        }, 1000);
        
    } catch (error) {
        await messageService.sendError(from, 'logout', msg);
    }
}

export default logoutCommand; 