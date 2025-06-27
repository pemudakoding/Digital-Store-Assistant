import config from "../../config/settings.js";

/**
 * Owner command - Display owner contact
 */
async function ownerCommand(context) {
    const { messageService, from, msg, client } = context;
    
    try {
        const ownerNumber = config.bot.ownerNumber;
        const ownerName = config.bot.ownerName;
        
        // Create vCard
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:;
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}
END:VCARD`;

        await client.sendMessage(from, {
            contacts: { 
                displayName: ownerName, 
                contacts: [{ vcard }] 
            }
        }, { quoted: msg });

        await messageService.reply(from, "*Itu kak nomor owner ku, Chat aja gk usah malu😆*", msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default ownerCommand; 