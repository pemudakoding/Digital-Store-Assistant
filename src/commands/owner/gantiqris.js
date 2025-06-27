import fs from "fs";
import { mediaService  } from "../../index.js";

/**
 * Gantiqris command - Change QRIS payment image
 */
async function gantiqrisCommand(context) {
    const { messageService, from, msg, isImage, isQuotedImage, sender } = context;
    
    try {
        if (!isImage && !isQuotedImage) {
            return await messageService.reply(from, `kirim gambar/reply gambar dengan caption gantiqris`, msg);
        }
        
        // Download and save media
        const media = await mediaService.downloadAndSaveMediaMessage("image", `./gambar/${sender}`);
        
        // Remove old QRIS and replace with new one
        if (fs.existsSync(`./gambar/qris.jpg`)) {
            fs.unlinkSync(`./gambar/qris.jpg`);
        }
        
        fs.renameSync(media, `./gambar/qris.jpg`);
        
        await messageService.reply(from, `Sukses mengganti Image Qris`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'gantiqris', msg);
    }
}

export default gantiqrisCommand; 