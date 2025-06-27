import config from "../../config/settings.js";

/**
 * Script command - Show script information
 */
async function scriptCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        const scriptInfo = `*🤖 SCRIPT INFORMATION*

*📛 Bot Name:* ${config.bot.botName}
*👨‍💻 Developer:* ${config.bot.ownerName}
*📧 Contact:* ${config.bot.kontakOwner}

*✨ Features:*
• Store Management System
• Group Management Tools
• Calculator Functions
• Social Media Integration
• Rental System
• Anti-Link Protection
• Welcome System
• AFK Management

*💻 Tech Stack:*
• Node.js
• Baileys WhatsApp API
• JSON Database
• Modular Architecture

*🌟 Version:* Refactored Clean Code
*📅 Last Update:* 2024

*Script ini telah di refactor dengan:*
✅ Clean Architecture
✅ Modular Command System
✅ Error Handling
✅ Permission System
✅ Structured Logging

Contact owner untuk info lebih lanjut!`;

        await messageService.reply(from, scriptInfo, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'script', msg);
    }
}

export default scriptCommand; 