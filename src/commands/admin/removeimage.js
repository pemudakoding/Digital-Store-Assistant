/**
 * Remove Image command - Remove image from list item (Admin only)
 * Usage: removeimage key
 */
export default async function removeImageCommand(context) {
    const { messageService, listManager, from, msg, args, isGroup, isGroupAdmin } = context;
    
    try {
        // Check if in group
        if (!isGroup) {
            return await messageService.reply(from,
                "❌ Command ini hanya bisa digunakan di grup!",
                msg
            );
        }

        // Check if user is admin
        if (!isGroupAdmin) {
            return await messageService.reply(from,
                "❌ Command ini hanya untuk admin grup!",
                msg
            );
        }

        if (args.length < 1) {
            return await messageService.reply(from,
                "*Cara penggunaan:*\n" +
                "removeimage *key*\n\n" +
                "*Contoh:*\n" +
                "removeimage netflix\n" +
                "removeimage diamond\n\n" +
                "*Fungsi:*\n" +
                "Menghapus gambar dari produk (teks deskripsi tetap ada)",
                msg
            );
        }

        const productKey = args[0];
        const listData = listManager.getListDb();
        
        if (!listManager.isAlreadyResponList(from, productKey, listData)) {
            return await messageService.reply(from,
                `❌ *Produk dengan key* *${productKey}* *tidak ditemukan!*\n\n` +
                "Gunakan command *list* untuk melihat semua produk yang tersedia.",
                msg
            );
        }

        // Get existing item data
        const existingItem = listManager.getDataResponList(from, productKey, listData);
        
        if (!existingItem.isImage) {
            return await messageService.reply(from,
                `ℹ️ *Produk* *${productKey}* *tidak memiliki gambar.*\n\n` +
                "Tidak ada yang perlu dihapus.",
                msg
            );
        }

        // Remove image (keep description, set isImage to false and clear image_url)
        listManager.updateResponList(from, productKey, existingItem.response, false, '', listData);
        
        let successMessage = `✅ *Berhasil menghapus gambar dari produk* *${productKey}*\n\n`;
        successMessage += `📝 *Deskripsi:* ${existingItem.response}\n`;
        successMessage += `🗑️ *Gambar:* Telah dihapus\n`;
        successMessage += `📱 *Status:* Produk sekarang hanya berupa teks`;
        
        await messageService.reply(from, successMessage, msg);
        
    } catch (error) {
        console.error('Error in removeimage command:', error);
        await messageService.reply(from,
            "❌ *Terjadi kesalahan saat menghapus gambar!*\n\n" +
            "Silakan coba lagi atau hubungi admin jika masalah berlanjut.",
            msg
        );
    }
} 