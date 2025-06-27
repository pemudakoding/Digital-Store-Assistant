import fs from "fs";
import { ImageUploadService } from "node-upload-images";

/**
 * Add testimonial command
 * Usage: addtesti key|testimonial_content
 */
export default async function addTestiCommand(context) {
    const { messageService, testiManager, from, msg, args } = context;
    
    try {
        if (args.length < 2) {
            return await messageService.reply(from,
                "Kirim perintah *addtesti* key|response\n\nContoh: addtesti netflix|Terimakasih udah order lagi🙏",
                msg
            );
        }

        const testiKey = args[0];
        const testiContent = args[1];
        
        if (!testiContent) {
            return await messageService.reply(from,
                "Response tidak boleh kosong!\n\nGunakan format: addtesti key|testimonial_content",
                msg
            );
        }

        const db_respon_testi = testiManager.getTestiDb();
        
        // Check if testimonial key already exists
        if (testiManager.isAlreadyResponTesti(testiKey, db_respon_testi)) {
            return await messageService.reply(from, `List respon dengan key : *${testiKey}* sudah ada.`, msg);
        }

        // Handle image attachment if present
        let isImage = false;
        let tphurl = '';
        
        if (msg.message?.imageMessage) {
            // Image processing would go here
            // For now, just mark as image
            isImage = true;
            tphurl = 'uploaded_image_url'; // This should be actual image upload
        }

        // Add testimonial
        testiManager.addResponTesti(testiKey, testiContent, isImage, tphurl, db_respon_testi);
        
        await messageService.reply(from, `✅ Berhasil menambah List testi *${testiKey}*\n\n*Konten:* ${testiContent}`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
} 