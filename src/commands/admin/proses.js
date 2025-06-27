import { common } from "../../index.js";

/**
 * Proses command - Set order status to processing using template
 */
async function prosesCommand(context) {
    const { messageService, templateManager, from, msg, args, isQuotedMsg, quotedMsg, groupName, time, date } = context;
    
    try {
        if (!isQuotedMsg) {
            return await messageService.reply(from, `Balas pesan orderan`, msg);
        }
        
        const set_proses = templateManager.getSetProsesDb();
        
        // Get custom template or use fallback
        const prosesTemplate = templateManager.sendResponSetProses(from, "proses", set_proses);
        
        let processedMessage;
        
        if (prosesTemplate) {
            // Use custom template
            const orderDetails = args.join(' ').trim() || '-';
            processedMessage = prosesTemplate
                .replace(/@pesan/g, orderDetails)
                .replace(/@nama/g, quotedMsg.sender.split("@")[0])
                .replace(/@jamwib/g, time)
                .replace(/@tanggal/g, date)
                .replace(/@groupname/g, groupName);
        } else {
            // Use fun fallback template
            const orderDetails = args.join(' ').trim() || '-';
            const fallbackTemplate = `🎯 *PESANAN SEDANG DIPROSES* 🎯\n\n` +
                `╭──────────────────╮\n` +
                `│ 📅 Tanggal : ${date}\n` +
                `│ ⏰ Waktu   : ${time}\n` +
                `│ 🔄 Status  : Processing\n` +
                `╰──────────────────╯\n\n` +
                `📋 *Detail Pesanan:* ${orderDetails}\n\n` +
                `🎉 Halo @${quotedMsg.sender.split("@")[0]}!\n` +
                `Pesanan kamu lagi diproses nih! 🚀\n\n` +
                `⚡ *Tim kami sedang bekerja keras untuk pesanan kamu!*\n` +
                `📱 Kamu akan dapat update selanjutnya segera\n` +
                `🙏 Terima kasih atas kesabarannya ya kak!\n\n` +
                `💫 *Stay tuned!* 💫`;
                
            processedMessage = fallbackTemplate;
        }
        
        // Reply to quoted message and mention the user
        await messageService.sendMentions(from, processedMessage, [quotedMsg.sender], { quoted: quotedMsg });
        
    } catch (error) {
        console.log(error)
        await messageService.sendError(from, 'proses', msg);
    }
}

export default prosesCommand; 