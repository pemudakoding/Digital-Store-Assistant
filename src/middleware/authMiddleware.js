import config from "../config/settings.js";

/**
 * Authentication and authorization middleware
 * @param {Object} context - Command execution context
 * @param {Object} command - Command configuration
 * @returns {boolean} Whether to continue execution
 */
async function authMiddleware(context, command) {
    const { sender, isGroup, reply, groupService } = context;
    
    // Ensure required services are available
    if (!groupService) {
        console.error('GroupService not available in context:', Object.keys(context));
        await reply('❌ Terjadi kesalahan sistem. Silakan coba lagi.');
        return false;
    }

    // Check owner-only commands
    if (command.ownerOnly) {
        const ownerNumbers = Array.isArray(config.bot.ownerNumber) 
            ? config.bot.ownerNumber 
            : [config.bot.ownerNumber];
        
        if (!ownerNumbers.includes(sender)) {
            await reply('❌ Perintah ini hanya dapat digunakan oleh owner bot');
            return false;
        }
    }

    // Check group-only commands
    if (command.groupOnly && !isGroup) {
        await reply('❌ Perintah ini hanya bisa digunakan di grup');
        return false;
    }

    // Check private-only commands
    if (command.privateOnly && isGroup) {
        await reply('❌ Perintah ini hanya bisa digunakan di private message');
        return false;
    }

    // Check admin-only commands in groups
    if (command.adminOnly && isGroup) {
        const isAdmin = await groupService.isGroupAdmin(context.from, sender);
        const ownerNumbers = Array.isArray(config.bot.ownerNumber) 
            ? config.bot.ownerNumber 
            : [config.bot.ownerNumber];
        const isOwner = ownerNumbers.includes(sender);
        
        if (!isAdmin && !isOwner) {
            await reply('❌ Perintah ini hanya bisa digunakan oleh Admin Grup');
            return false;
        }
    }

    // Check if bot needs admin privileges
    if (command.botAdminOnly && isGroup) {
        const isBotAdmin = await groupService.isBotGroupAdmin(context.from);
        
        if (!isBotAdmin) {
            await reply('❌ Bot harus menjadi admin untuk menggunakan perintah ini');
            return false;
        }
    }

    return true;
}

export default authMiddleware; 