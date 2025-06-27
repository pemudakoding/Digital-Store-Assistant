/**
 * Show command registry information and statistics
 */
export default async function commandinfo(context, args) {
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

        const registry = bot.commandRegistry;
        const commandHandler = bot.commandHandler;

        // Get statistics
        const loadedCommands = registry.getLoadedCommands();
        const commandsByCategory = {};
        
        // Group commands by category
        loadedCommands.forEach(cmd => {
            if (!commandsByCategory[cmd.category]) {
                commandsByCategory[cmd.category] = [];
            }
            commandsByCategory[cmd.category].push(cmd);
        });

        // Get command stats from handler
        const commandStats = commandHandler.getCommandStats();
        const totalExecutions = Array.from(commandStats.values())
            .reduce((sum, stat) => sum + stat.executions, 0);
        const totalErrors = Array.from(commandStats.values())
            .reduce((sum, stat) => sum + stat.errors, 0);

        // If specific category requested
        if (args.length > 0) {
            const category = args[0].toLowerCase();
            const categoryCommands = commandsByCategory[category];
            
            if (!categoryCommands) {
                return await messageService.reply(
                    from,
                    `❌ Kategori '${category}' tidak ditemukan.\n\nKategori tersedia: ${Object.keys(commandsByCategory).join(', ')}`,
                    msg
                );
            }

            let categoryInfo = `📂 *Kategori: ${category.toUpperCase()}*\n`;
            categoryInfo += `📊 Total commands: ${categoryCommands.length}\n\n`;

            categoryCommands.forEach(cmd => {
                const stats = commandStats.get(cmd.name) || { executions: 0, errors: 0 };
                const aliases = cmd.aliases?.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
                
                categoryInfo += `▫️ *${cmd.name}*${aliases}\n`;
                categoryInfo += `   📝 ${cmd.description}\n`;
                categoryInfo += `   📈 Executions: ${stats.executions} | Errors: ${stats.errors}\n\n`;
            });

            return await messageService.reply(from, categoryInfo, msg);
        }

        // General overview
        let responseText = `🤖 *Command Registry Information*\n\n`;
        responseText += `📊 *Statistics:*\n`;
        responseText += `▫️ Total commands: ${loadedCommands.length}\n`;
        responseText += `▫️ Total categories: ${Object.keys(commandsByCategory).length}\n`;
        responseText += `▫️ Total executions: ${totalExecutions}\n`;
        responseText += `▫️ Total errors: ${totalErrors}\n`;
        responseText += `▫️ Success rate: ${totalExecutions > 0 ? ((totalExecutions - totalErrors) / totalExecutions * 100).toFixed(1) : 100}%\n\n`;

        responseText += `📂 *Commands by Category:*\n`;
        Object.entries(commandsByCategory)
            .sort(([,a], [,b]) => b.length - a.length)
            .forEach(([category, commands]) => {
                responseText += `▫️ ${category}: ${commands.length} commands\n`;
            });

        responseText += `\n💡 *Tips:*\n`;
        responseText += `▫️ Use \`commandinfo <category>\` for details\n`;
        responseText += `▫️ Available categories: ${Object.keys(commandsByCategory).join(', ')}\n`;
        responseText += `▫️ Use \`reloadcommands\` to reload all commands`;

        return await messageService.reply(from, responseText, msg);
        
    } catch (error) {
        console.error('Error in commandinfo:', error);
        
        const errorText = `❌ *Error showing command info*\n\nError: ${error.message}`;
        return await context.messageService.reply(context.from, errorText, context.msg);
    }
}

// Export metadata for CommandRegistry
export const metadata = {
    description: 'Show command registry information and statistics',
    category: 'owner',
    ownerOnly: true,
    aliases: ['cmdinfo', 'commandstats']
}; 