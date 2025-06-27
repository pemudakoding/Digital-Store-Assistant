import { common } from "../../index.js";

/**
 * Done command - Set order status to completed using template
 */
async function doneCommand(context) {
    const { messageService, templateManager, from, msg, args, isQuotedMsg, quotedMsg, groupName, time, date } = context;
    
    try {
        if (!isQuotedMsg) {
            return await messageService.reply(from, `Balas pesan orderan`, msg);
        }
        
        const set_done = templateManager.getSetDoneDb();
        
        // Get custom template or use fallback
        const doneTemplate = templateManager.sendResponSetDone(from, "done", set_done);
        
        let processedMessage;
        
        if (doneTemplate) {
            // Use custom template
            const orderDetails = args.join(' ').trim() || '-';
            processedMessage = doneTemplate
                .replace(/@pesan/g, orderDetails)
                .replace(/@nama/g, "@"+quotedMsg.sender.split("@")[0])
                .replace(/@jamwib/g, time)
                .replace(/@tanggal/g, date)
                .replace(/@groupname/g, groupName);
        } else {
            // Use fun fallback template
            const orderDetails = args.join(' ').trim() || '-';
            const fallbackTemplate = `✅ *PESANAN SELESAI* ✅\n\n` +
                `╭──────────────────╮\n` +
                `│ 📅 Tanggal : ${date}\n` +
                `│ ⏰ Waktu   : ${time}\n` +
                `│ ✨ Status  : Completed\n` +
                `╰──────────────────╯\n\n` +
                `📋 *Detail Pesanan:* ${orderDetails}\n\n` +
                `🎉 Yeay @${quotedMsg.sender.split("@")[0]}!\n` +
                `Pesanan kamu sudah selesai nih! 🚀\n\n` +
                `✅ *Pesanan berhasil diselesaikan dengan sempurna!*\n` +
                `🎁 Silakan cek dan nikmati pesanan kamu\n` +
                `🙏 Terima kasih sudah mempercayai kami!\n\n` +
                `⭐ *Next Order ya?* ⭐`;
                
            processedMessage = fallbackTemplate;
        }
        
        // Reply to quoted message and mention the user
        await messageService.sendMentions(from, processedMessage, [quotedMsg.sender], { quoted: quotedMsg });
        
    } catch (error) {
        console.log(error)
        await messageService.sendError(from, 'done', msg);
    }
}

export default doneCommand; 