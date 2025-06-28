import config from "../../config/settings.js";
import fs from "fs";

/**
 * Donasi command - Display donation information
 */
async function donasiCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        let tekssss = `───「  *DONASI*  」────

*Terima kasih atas dukungan Anda! 💰*

Berapapun donasi dari kalian itu sangat berarti bagi kami untuk terus mengembangkan bot ini.

Untuk informasi donasi, silakan hubungi owner bot.
`;

        // Check if QRIS image exists
        const qrisPath = "./gambar/qris.jpg";
        if (fs.existsSync(qrisPath)) {
            await messageService.sendImage(from, qrisPath, tekssss, msg);
        } else {
            await messageService.reply(from, tekssss, msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default donasiCommand; 