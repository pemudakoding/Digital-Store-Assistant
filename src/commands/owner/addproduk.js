import fs from "fs";
import { ImageUploadService } from "node-upload-images";

/**
 * Addproduk command - Add new product with image
 * 
 * Usage: addproduk key@description (with image)
 * Example:
 *   addproduk netflix@Netflix Premium Account
 *   Harga: Rp 25.000/bulan
 *   ✅ Garansi seumur hidup
 *   ✅ Support 24/7
 * 
 * Features:
 * - Preserves line breaks in product descriptions
 * - Supports multi-line descriptions for better formatting
 * - Requires image upload for visual product catalog
 */
async function addprodukCommand(context) {
    const { messageService, produkManager, from, msg, body, isImage, isQuotedImage, sender, mediaService } = context;
    
    try {
        // Extract content from original body to preserve line breaks
        const commandPattern = /^[.!]?addproduk\s*/i;
        const contentAfterCommand = body.replace(commandPattern, '').trim();
        
        if (!contentAfterCommand.includes("@")) {
            return await messageService.reply(from, 
                `*Cara penggunaan:*\n` +
                `addproduk *key@response*\n\n` +
                `*Contoh:*\n` +
                `addproduk produk1@Deskripsi produk lengkap\n` +
                `Harga: Rp 50.000\n` +
                `✅ Fitur premium\n` +
                `✅ Garansi 30 hari\n\n` +
                `*Note:* Wajib kirim dengan gambar atau reply gambar`, msg);
        }
        
        if (!isImage && !isQuotedImage) {
            return await messageService.reply(from, 
                `📸 *Gambar diperlukan!*\n\n` +
                `Kirim gambar dengan caption addproduk *key@response* atau reply gambar yang sudah ada dengan caption addproduk *key@response*`, msg);
        }
        
        // Split by first @ only to preserve @ symbols in description
        const firstAtIndex = contentAfterCommand.indexOf("@");
        const args1 = contentAfterCommand.substring(0, firstAtIndex).trim();
        const args2 = contentAfterCommand.substring(firstAtIndex + 1);
        
        if (!args1 || !args2.trim()) {
            return await messageService.reply(from, 
                `*Format salah!*\n` +
                `Gunakan: addproduk *key@response*\n\n` +
                `*Contoh:*\n` +
                `addproduk netflix@Netflix Premium\n` +
                `Akses unlimited ke semua konten`, msg);
        }
        
        const db_respon_produk = produkManager.getProdukDb();
        
        if (produkManager.isAlreadyResponProduk(args1, db_respon_produk)) {
            return await messageService.reply(from, `List respon dengan key : *${args1}* sudah ada.`, msg);
        }
        
        // Download and upload image
        const media = await mediaService.downloadAndSaveMediaMessage("image", `./gambar/${sender}`);
        
        // Upload to telegraph
        async function TelegraPh(path) {
            const service = new ImageUploadService("pixhost.to");
            try {
                let { directLink } = await service.uploadFromBinary(
                    fs.readFileSync(path),
                    "ramagnz.jpg",
                );
                return directLink.toString();
            } catch (err) {
                throw new Error(String(err));
            }
        }
        
        const tphurl = await TelegraPh(media);
        
        // Add product with preserved line breaks in description
        produkManager.addResponProduk(args1, args2, true, tphurl, db_respon_produk);
        
        let successMessage = `✅ *Berhasil menambah List produk* *${args1}*\n\n`;
        successMessage += `📝 *Deskripsi:*\n${args2}\n\n`;
        successMessage += `🖼️ *Gambar:* Berhasil diupload!\n`;
        successMessage += `🔗 *URL:* ${tphurl}`;
        
        await messageService.reply(from, successMessage, msg);
        
        if (fs.existsSync(media)) {
            fs.unlinkSync(media);
        }
        
    } catch (error) {
        console.error('Error in addproduk command:', error);
        await messageService.reply(from, 
            "❌ *Terjadi kesalahan saat menambahkan produk!*\n\n" +
            "Silakan coba lagi atau hubungi admin jika masalah berlanjut.", 
            msg
        );
    }
}

export default addprodukCommand; 