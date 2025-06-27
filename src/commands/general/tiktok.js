import { scraperService  } from "../../index.js";
/**
 * TikTok Download command
 */
async function tiktokCommand(context) {
    const { messageService, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, `Example : tiktok link`, msg);
        }
        
        if (!fullArgs.includes("tiktok")) {
            return await messageService.reply(from, `Link Invalid!!`, msg);
        }
        
        await messageService.reply(from, "⏳ Tunggu sebentar...", msg);
        
        const data = await scraperService.Tiktok(fullArgs);
        
        await messageService.sendMessage(from, {
            video: { url: data.watermark },
            caption: `*Download Tiktok No Wm*`
        }, { quoted: msg });
        
    } catch (error) {
        await messageService.sendError(from, 'tiktok', msg);
    }
}

export default tiktokCommand; 