/**
 * Add list command - Add item to store list with optional image support
 * Usage: addlist product_name|description (with or without image)
 * 
 * Features:
 * - Preserves line breaks in product descriptions
 * - Supports multi-line descriptions for better formatting
 * - Optional image upload support
 */
import { downloadContentFromMessage } from "baileys";

async function addListCommand(context) {
    const { messageService, listManager, from, msg, body, client, isQuotedMsg, quotedMsg } = context;
    
    try {
        // Extract content from original body to preserve line breaks
        const commandPattern = /^[.!]?addlist\s*/i;
        const contentAfterCommand = body.replace(commandPattern, '').trim();
        
        // Check if content contains pipe separator
        if (!contentAfterCommand.includes('|')) {
            const usage = "*Cara penggunaan:*\n" +
                "addlist <nama_produk>|<deskripsi>\n\n" +
                "*Contoh:*\n" +
                "addlist Netflix|Premium Account Netflix 1 Bulan - Rp 25.000\n" +
                "addlist Diamond ML|Top up Diamond Mobile Legends\n" +
                "Promo spesial hari ini!\n" +
                "✅ Instant delivery\n" +
                "✅ 24/7 support\n\n" +
                "*Untuk menambahkan gambar:*\n" +
                "1. Kirim gambar bersamaan dengan command\n" +
                "2. Reply gambar dengan command addlist\n" +
                "3. Gambar akan otomatis ter-upload dan tersimpan";
            
            return await messageService.reply(from, usage, msg);
        }

        // Split by first pipe only to preserve pipes in description
        const firstPipeIndex = contentAfterCommand.indexOf('|');
        const productName = contentAfterCommand.substring(0, firstPipeIndex).trim();
        const description = contentAfterCommand.substring(firstPipeIndex + 1);
        
        if (!productName || !description.trim()) {
            const usage = "*Format salah!*\n" +
                "Gunakan: addlist <nama_produk>|<deskripsi>\n\n" +
                "*Contoh:*\n" +
                "addlist Netflix|Premium Account Netflix 1 Bulan\n" +
                "Harga: Rp 25.000\n" +
                "Garansi: 30 hari";
            
            return await messageService.reply(from, usage, msg);
        }
        
        const listData = listManager.getListDb();
        
        // Check if product already exists
        if (listManager.isAlreadyResponList(from, productName, listData)) {
            return await messageService.reply(from, `Produk *${productName}* sudah ada dalam list!`, msg);
        }

        // Handle image processing
        let isImage = false;
        let imageUrl = '';

        try {
            // Check for image in current message
            if (msg.message?.imageMessage) {
                await messageService.reply(from, "📸 *Sedang mengupload gambar...*", msg);
                
                const stream = await downloadContentFromMessage(msg.message.imageMessage, "image");
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                
                isImage = true;
                imageUrl = await uploadImageToService(buffer);
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
            }
        } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            await messageService.reply(from, "⚠️ *Gagal mengupload gambar, produk akan ditambahkan tanpa gambar.*", msg);
        }

        // Add new product (preserve line breaks in description)
        listManager.addResponList(from, productName, description, isImage, imageUrl, listData);
        
        let successMessage = `✅ *Berhasil menambahkan produk* *${productName}* *ke dalam list!*\n\n`;
        successMessage += `📝 *Deskripsi:*\n${description}\n\n`;
        
        if (isImage && imageUrl) {
            successMessage += `🖼️ *Gambar:* Berhasil diupload!\n`;
            successMessage += `🔗 *URL:* ${imageUrl}\n`;
            successMessage += `📱 *Status:* Gambar akan ditampilkan saat produk dipanggil`;
        } else {
            successMessage += `📷 *Gambar:* Tidak ada gambar`;
        }
        
        await messageService.reply(from, successMessage, msg);
        
    } catch (error) {
        console.error('Error in addlist command:', error);
        await messageService.reply(from, 
            "❌ *Terjadi kesalahan saat menambahkan produk!*\n\n" +
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

export default addListCommand; 