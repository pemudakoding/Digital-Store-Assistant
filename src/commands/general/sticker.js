import config from "../../config/settings.js";
import { downloadContentFromMessage  } from "baileys";
import fs from "fs";

/**
 * Sticker command - Convert image/video to sticker
 */
async function stickerCommand(context) {
    const { messageService, from, msg, client } = context;
    
    try {
        const isImage = msg.message?.imageMessage;
        const isVideo = msg.message?.videoMessage;
        const isQuotedImage = msg.quoted?.message?.imageMessage;
        const isQuotedVideo = msg.quoted?.message?.videoMessage;
        
        if (isImage || isQuotedImage) {
            await messageService.reply(from, "⏳ Sedang memproses gambar...", msg);
            
            const stream = await downloadContentFromMessage(
                isImage ? msg.message.imageMessage : msg.quoted.message.imageMessage,
                "image"
            );
            
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const tempPath = `./temp_${Date.now()}.jpg`;
            fs.writeFileSync(tempPath, buffer);
            
            await client.sendImageAsSticker(from, tempPath, msg, {
                packname: config.bot.namaStore || "KoalaStore Bot",
                author: "Store Bot"
            });
            
            // Cleanup
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
            
        } else if (isVideo || isQuotedVideo) {
            await messageService.reply(from, "⏳ Sedang memproses video...", msg);
            
            const stream = await downloadContentFromMessage(
                isVideo ? msg.message.videoMessage : msg.quoted.message.videoMessage,
                "video"
            );
            
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            
            const tempPath = `./temp_${Date.now()}.mp4`;
            fs.writeFileSync(tempPath, buffer);
            
            await client.sendVideoAsSticker(from, tempPath, msg, {
                packname: config.bot.namaStore || "KoalaStore Bot",
                author: "Store Bot"
            });
            
            // Cleanup
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
            
        } else {
            await messageService.reply(from, "Kirim/reply gambar/video dengan caption *sticker*", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default stickerCommand; 