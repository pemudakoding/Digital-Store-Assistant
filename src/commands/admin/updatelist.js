import fs from "fs";
import { downloadContentFromMessage } from "baileys";

/**
 * Update list command - Update existing list item with optional image support
 * Usage: updatelist key|new_description (with or without image)
 * 
 * Features:
 * - Preserves line breaks in product descriptions
 * - Supports multi-line descriptions for better formatting
 * - Optional image update support
 */
export default async function updateListCommand(context) {
    const { messageService, listManager, from, msg, body, client, isQuotedMsg, quotedMsg } = context;
    
    try {
        // Extract content from original body to preserve line breaks
        const commandPattern = /^[.!]?updatelist\s*/i;
        const contentAfterCommand = body.replace(commandPattern, '').trim();
        
        // Check if content contains pipe separator
        if (!contentAfterCommand.includes('|')) {
            return await messageService.reply(from,
                "*Cara penggunaan:*\n" +
                "updatelist *key*|*response*\n\n" +
                "*Contoh:*\n" +
                "updatelist netflix|Netflix Premium 1 Bulan - Updated\n" +
                "Harga baru: Rp 30.000\n" +
                "✅ Garansi 1 bulan\n" +
                "✅ Support 24/7\n\n" +
                "*Untuk update dengan gambar:*\n" +
                "1. Kirim gambar bersamaan dengan command\n" +
                "2. Reply gambar dengan command updatelist\n" +
                "3. Gambar lama akan diganti dengan yang baru",
                msg
            );
        }

        // Split by first pipe only to preserve pipes in description
        const firstPipeIndex = contentAfterCommand.indexOf('|');
        const productKey = contentAfterCommand.substring(0, firstPipeIndex).trim();
        const newDescription = contentAfterCommand.substring(firstPipeIndex + 1);
        
        if (!productKey || !newDescription.trim()) {
            return await messageService.reply(from,
                "*Format salah!*\n" +
                "Gunakan: updatelist *key*|*response*\n\n" +
                "*Contoh:*\n" +
                "updatelist netflix|Netflix Premium 1 Bulan\n" +
                "Update terbaru dengan fitur baru!",
                msg
            );
        }
        
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

        // Update list item (preserve line breaks in description)
        listManager.updateResponList(from, productKey, newDescription, isImage, imageUrl, db_respon_list);
        
        let successMessage = `✅ *Berhasil update List* *${productKey}*\n\n`;
        successMessage += `📝 *Deskripsi Baru:*\n${newDescription}\n\n`;
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
    const { uploadImage } = await import('../../utils/imageUploader.js');
    return await uploadImage(mediaData);
} 