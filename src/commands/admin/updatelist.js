import fs from "fs";
import { downloadContentFromMessage } from "baileys";

/**
 * Update list command - Update existing list item with optional image support
 * Usage: updatelist key|new_description (with or without image)
 */
export default async function updateListCommand(context) {
    const { messageService, listManager, from, msg, args, fullArgs, client, isQuotedMsg, quotedMsg } = context;
    
    try {
        if (args.length < 2) {
            return await messageService.reply(from,
                "*Cara penggunaan:*\n" +
                "updatelist *key*|*response*\n\n" +
                "*Contoh:*\n" +
                "updatelist netflix|Netflix Premium 1 Bulan - Updated\n\n" +
                "*Untuk update dengan gambar:*\n" +
                "1. Kirim gambar bersamaan dengan command\n" +
                "2. Reply gambar dengan command updatelist\n" +
                "3. Gambar lama akan diganti dengan yang baru",
                msg
            );
        }

        const productKey = args[0];
        const newDescription = args[1];
        
        const db_respon_list = listManager.getListDb();
        
        if (!listManager.isAlreadyResponList(from, productKey, db_respon_list)) {
            return await messageService.reply(from, `List respon dengan key *${productKey}* tidak ada di group ini.`, msg);
        }

        // Get existing item data
        const existingItem = listManager.getDataResponList(from, productKey, db_respon_list);
        
        // Handle image processing
        let isImage = existingItem?.isImage || false;
        let imageUrl = existingItem?.image_url || '';
        let imageStatusMessage = '';

        try {
            // Check for image in current message
            if (msg.message?.imageMessage) {
                await messageService.reply(from, "📸 *Sedang mengupload gambar baru...*", msg);
                
                const stream = await downloadContentFromMessage(msg.message.imageMessage, "image");
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                isImage = true;
                imageUrl = await uploadImageToService(buffer);
                imageStatusMessage = "📸 *Gambar baru berhasil diupload!*";
            }
            // Check for image in quoted message
            else if (isQuotedMsg && quotedMsg?.message?.imageMessage) {
                await messageService.reply(from, "📸 *Sedang mengupload gambar dari reply...*", msg);
                
                const stream = await downloadContentFromMessage(quotedMsg.message.imageMessage, "image");
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                isImage = true;
                imageUrl = await uploadImageToService(buffer);
                imageStatusMessage = "📸 *Gambar baru berhasil diupload dari reply!*";
            }
            // If no new image, keep existing status
            else if (existingItem?.isImage) {
                imageStatusMessage = "🖼️ *Gambar lama tetap dipertahankan*";
            } else {
                imageStatusMessage = "📷 *Tidak ada gambar*";
            }
        } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            imageStatusMessage = "⚠️ *Gagal mengupload gambar baru, gambar lama dipertahankan*";
            // Keep existing image data if upload fails
            isImage = existingItem?.isImage || false;
            imageUrl = existingItem?.image_url || '';
        }

        // Update list item
        listManager.updateResponList(from, productKey, newDescription, isImage, imageUrl, db_respon_list);
        
        let successMessage = `✅ *Berhasil update List* *${productKey}*\n\n`;
        successMessage += `📝 *Deskripsi Baru:* ${newDescription}\n`;
        successMessage += `${imageStatusMessage}\n`;
        
        if (isImage && imageUrl) {
            successMessage += `🔗 *URL Gambar:* ${imageUrl}\n`;
            successMessage += `📱 *Status:* Gambar akan ditampilkan saat produk dipanggil`;
        }
        
        await messageService.reply(from, successMessage, msg);
        
    } catch (error) {
        console.error('Error in updatelist command:', error);
        await messageService.reply(from,
            "❌ *Terjadi kesalahan saat mengupdate produk!*\n\n" +
            "Silakan coba lagi atau hubungi admin jika masalah berlanjut.",
            msg
        );
    }
}

/**
 * Upload image to external service (Uguu.se)
 * @param {Buffer} mediaData - Image buffer data
 * @returns {Promise<string>} Image URL
 */
async function uploadImageToService(mediaData) {
    const fs = await import('fs');
    const crypto = await import('crypto');
    const BodyForm = (await import('form-data')).default;
    const axios = (await import('axios')).default;
    
    return new Promise(async (resolve, reject) => {
        try {
            // Save image to temporary file
            const tempFileName = `./gambar/temp_${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`;
            fs.writeFileSync(tempFileName, mediaData);
            
            // Upload to Uguu.se
            const form = new BodyForm();
            form.append('files[]', fs.createReadStream(tempFileName));
            
            const response = await axios({
                url: 'https://uguu.se/upload.php',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                    ...form.getHeaders()
                },
                data: form
            });
            
            // Clean up temp file
            if (fs.existsSync(tempFileName)) {
                fs.unlinkSync(tempFileName);
            }
            
            if (response.data.files && response.data.files[0] && response.data.files[0].url) {
                resolve(response.data.files[0].url);
            } else {
                reject(new Error('Upload failed - no URL returned'));
            }
            
        } catch (err) {
            console.error('Upload error:', err);
            reject(err);
        }
    });
} 