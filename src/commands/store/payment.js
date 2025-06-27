import config from "../../config/settings.js";
import fs from "fs";

/**
 * Payment command - Show payment information
 */
async function paymentCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        const paymentText = `───「  *PAYMENT*  」────

- *Dana :* ${config.payment.dana}
- *Gopay :*  ${config.payment.gopay}
- *Ovo :* ${config.payment.ovo}
- *Qris :* Scan qr di atas

OK, thanks udah order di *${config.bot.botName}*
`;

        await messageService.sendMessage(from, {
            image: fs.readFileSync(`./gambar/qris.jpg`),
            caption: paymentText,
            footer: `${config.bot.ownerName} © 2022`
        }, { quoted: msg });
        
    } catch (error) {
        await messageService.sendError(from, 'payment', msg);
    }
}

export default paymentCommand; 