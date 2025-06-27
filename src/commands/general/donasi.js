import config from "../../config/settings.js";
import fs from "fs";

/**
 * Donasi command - Display donation information
 */
async function donasiCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        let tekssss = `───「  *DONASI*  」────

*Payment donasi💰*

- *Dana :* ${config.payment.dana}
- *Gopay :*  ${config.payment.gopay}
- *Ovo :* ${config.payment.ovo}
- *Saweria :* ${config.payment.sawer}
- *Qris :* Scan qr di atas

berapapun donasi dari kalian itu sangat berarti bagi kami
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