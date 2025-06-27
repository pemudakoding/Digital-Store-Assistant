/**
 * Hot reload all commands - useful for development
 */
export default async function reloadcommands(context) {
    try {
        const { messageService, from, msg } = context;
        
        // Access the bot instance through context if available
        const bot = context.bot || global.bot;
        
        if (!bot || !bot.commandRegistry) {
            return await messageService.reply(
                from,
                "❌ Command registry tidak tersedia",
                msg
            );
        }

        await messageService.reply(
            from,
            "🔄 Memulai hot reload semua commands...",
            msg
        );

        const startTime = Date.now();
        const totalLoaded = await bot.commandRegistry.hotReloadAllCommands();
        const executionTime = Date.now() - startTime;

        const responseText = `✅ *Hot Reload Berhasil*

🔧 Total commands: ${totalLoaded}
⏱️ Waktu eksekusi: ${executionTime}ms
📁 Semua commands telah di-reload ulang

Commands siap digunakan dengan konfigurasi terbaru!`;

        return await messageService.reply(from, responseText, msg);
        
    } catch (error) {
        console.error('Error in reloadcommands:', error);
        
        const errorText = `❌ *Hot Reload Gagal*

Error: ${error.message}

Silakan check logs untuk detail error.`;

        return await context.messageService.reply(context.from, errorText, context.msg);
    }
}

// Export metadata for CommandRegistry
export const metadata = {
    description: 'Hot reload all commands (development only)',
    category: 'owner',
    ownerOnly: true,
    aliases: ['reload', 'hotreload']
}; 