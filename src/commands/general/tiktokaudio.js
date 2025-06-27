import { scraperService  } from "../../index.js";
/**
 * TikTok Audio Download command
 */
async function tiktokAudioCommand(context) {
    const { messageService, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, `Example : tiktokaudio link`, msg);
        }
        
        if (!fullArgs.includes("tiktok")) {
            return await messageService.reply(from, `Link Invalid!!`, msg);
        }
        
        await messageService.reply(from, "⏳ Tunggu sebentar...", msg);
        
        const data = await scraperService.Tiktok(fullArgs);
        
        await messageService.sendMessage(from, {
            audio: { url: data.audio },
            mimetype: "audio/mp4"
        }, { quoted: msg });
        
    } catch (error) {
        await messageService.sendError(from, 'tiktokaudio', msg);
    }
}

export default tiktokAudioCommand; 