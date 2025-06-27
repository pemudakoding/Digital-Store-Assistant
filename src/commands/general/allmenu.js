/**
 * All Menu command - Automatically generated from command registry
 */

import { commandsConfig, getAllCategories, getCategoryCommands, getTotalCommandCount } from "../registry/commandsConfig.js";

async function allmenuCommand(context) {
    const { messageService, from, msg, isGroup, isAdmin, isOwner, client } = context;
    
    try {
        const menu = await generateDynamicMenu(context);
        await messageService.reply(from, menu, msg);
        
    } catch (error) {
        console.error('All menu error:', error);
        await messageService.sendError(from, 'general', msg);
    }
}

/**
 * Generate dynamic menu based on current command registry
 */
async function generateDynamicMenu(context) {
    const { isGroup, isAdmin, isOwner } = context;
    
    // Get total command count for header
    const totalCommands = getTotalCommandCount();
    
    let menu = `
───「 *⭐ ALL MENU ⭐* 」───

📊 *Total Commands:* ${totalCommands}
🔥 *Auto-Generated Menu*

`;

    // Define category display order and styling
    const categoryConfig = {
        general: {
            title: '『 💫 𝙂𝙚𝙣𝙚𝙧𝙖𝙡 𝙈𝙚𝙣𝙪 』',
            icon: '🔸',
            description: 'Commands available to all users'
        },
        store: {
            title: '『 🛒 𝙎𝙩𝙤𝙧𝙚 𝙈𝙚𝙣𝙪 』',
            icon: '🛍️',
            description: 'Digital store and product commands'
        },
        calculator: {
            title: '『 🧮 𝙆𝙖𝙡𝙠𝙪𝙡𝙖𝙩𝙤𝙧 』',
            icon: '🔢',
            description: 'Mathematical operations'
        },
        admin: {
            title: '『 ⚡ 𝘼𝙙𝙢𝙞𝙣 𝙈𝙚𝙣𝙪 』',
            icon: '⚙️',
            description: 'Group moderation and management'
        },
        owner: {
            title: '『 👑 𝙊𝙬𝙣𝙚𝙧 𝙈𝙚𝙣𝙪 』',
            icon: '💎',
            description: 'Bot administration and system control'
        }
    };

    // Process each category in specific order
    const categoryOrder = ['general', 'store', 'calculator', 'admin', 'owner'];
    
    for (const category of categoryOrder) {
        const commands = getCategoryCommands(category);
        const config = categoryConfig[category];
        
        if (!commands || Object.keys(commands).length === 0) continue;
        
        // Filter commands based on user permissions and context
        const availableCommands = filterCommandsByPermissions(commands, { isGroup, isAdmin, isOwner });
        
        if (availableCommands.length === 0) continue;
        
        // Add category header
        menu += `\n┏${' '.repeat(10)}${config.title}${' '.repeat(10)}◧\n\n`;
        
        // Add commands in this category
        availableCommands.forEach(({ commandName, commandConfig }) => {
            const displayName = getDisplayName(commandName, commandConfig);
            const aliases = getAliasesText(commandConfig.aliases);
            const restrictions = getRestrictionsText(commandConfig);
            
            menu += `${config.icon} ${displayName}${aliases}${restrictions}\n`;
        });
        
        menu += `\n┗━◧\n`;
    }

    // Add footer with additional info
    menu += `\n\n📝 *Legend:*\n`;
    menu += `• 🔒 = Admin only\n`;
    menu += `• 👑 = Owner only\n`;
    menu += `• 👥 = Group only\n`;
    menu += `• 💬 = Private only\n`;
    
    menu += `\n💡 *Tips:*\n`;
    menu += `• Use \`help <command>\` for detailed info\n`;
    menu += `• Commands update automatically when new ones are added\n`;
    
    menu += `\n┗━━━━━━━━━━━━━━━━━━◧`;

    return menu;
}

/**
 * Filter commands based on user permissions and context
 */
function filterCommandsByPermissions(commands, { isGroup, isAdmin, isOwner }) {
    const filtered = [];
    
    for (const [commandName, commandConfig] of Object.entries(commands)) {
        // Check owner permission
        if (commandConfig.ownerOnly && !isOwner) continue;
        
        // Check admin permission
        if (commandConfig.adminOnly && !isAdmin && !isOwner) continue;
        
        // Check group context
        if (commandConfig.groupOnly && !isGroup) continue;
        
        // Check private context
        if (commandConfig.privateOnly && isGroup) continue;
        
        filtered.push({ commandName, commandConfig });
    }
    
    // Sort commands alphabetically
    return filtered.sort((a, b) => a.commandName.localeCompare(b.commandName));
}

/**
 * Get display name for command (use alias if specified)
 */
function getDisplayName(commandName, commandConfig) {
    return commandConfig.name || commandName;
}

/**
 * Get aliases text for display
 */
function getAliasesText(aliases) {
    if (!aliases || aliases.length === 0) return '';
    return ` (${aliases.join(', ')})`;
}

/**
 * Get restrictions text for display
 */
function getRestrictionsText(commandConfig) {
    const restrictions = [];
    
    if (commandConfig.ownerOnly) restrictions.push('👑');
    else if (commandConfig.adminOnly) restrictions.push('🔒');
    
    if (commandConfig.groupOnly) restrictions.push('👥');
    if (commandConfig.privateOnly) restrictions.push('💬');
    
    return restrictions.length > 0 ? ` ${restrictions.join('')}` : '';
}

/**
 * Legacy menu for comparison/fallback (if needed)
 */
function getLegacyMenu() {
    return `
───「 *⭐LEGACY MENU⭐* 」───

This is the old static menu.
The new menu is auto-generated from command registry.

┗━━━━━━━━━━━━━━━━━━◧
`;
}

export default allmenuCommand; 