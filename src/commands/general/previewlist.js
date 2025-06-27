/**
 * Preview List command - Preview list item with image if available
 * Usage: previewlist key
 */
export default async function previewListCommand(context) {
    const { messageService, listManager, from, msg, args, client, isGroup } = context;
    
    try {
        if (!isGroup) {
            return await messageService.reply(from,
                "❌ Command ini hanya bisa digunakan di grup!",
                msg
            );
        }

        if (args.length < 1) {
            return await messageService.reply(from,
                "*Cara penggunaan:*\n" +
                "previewlist *key*\n\n" +
                "*Contoh:*\n" +
                "previewlist netflix\n" +
                "previewlist diamond\n\n" +
                "*Fungsi:*\n" +
                "Menampilkan preview produk beserta gambar (jika ada)",
                msg
            );
        }

        const productKey = args[0].toLowerCase();
        const listData = listManager.getListDb();
        
        // Find product in this group
        const product = listData.find(item => 
            item.id === from && 
            item.key.toLowerCase() === productKey
        );

        if (!product) {
            return await messageService.reply(from,
                `❌ *Produk dengan key* *${productKey}* *tidak ditemukan!*\n\n` +
                "Gunakan command *list* untuk melihat semua produk yang tersedia.",
                msg
            );
        }

        // Create preview message
        let previewMessage = `🔍 *PREVIEW PRODUK*\n\n`;
        previewMessage += `🏷️ *Key:* ${product.key}\n`;
        previewMessage += `📝 *Deskripsi:*\n${product.response}\n\n`;
        
        if (product.isClose) {
            previewMessage += `🚫 *Status:* TUTUP SEMENTARA\n`;
        } else {
            previewMessage += `✅ *Status:* TERSEDIA\n`;
        }

        // Send message with or without image
        if (product.isImage && product.image_url) {
            try {
                previewMessage += `🖼️ *Gambar:* Tersedia\n`;
                previewMessage += `🔗 *URL:* ${product.image_url}`;

                await client.sendMessage(from, {
                    image: { url: product.image_url },
                    caption: previewMessage
                }, { quoted: msg });
                
            } catch (imageError) {
                console.error('Error sending image:', imageError);
                previewMessage += `⚠️ *Gambar:* Error loading image\n`;
                previewMessage += `🔗 *URL:* ${product.image_url}\n`;
                previewMessage += `_Silakan cek URL manual atau gambar mungkin sudah expired_`;
                
                await messageService.reply(from, previewMessage, msg);
            }
        } else {
            previewMessage += `📷 *Gambar:* Tidak ada gambar`;
            await messageService.reply(from, previewMessage, msg);
        }
        
    } catch (error) {
        console.error('Error in previewlist command:', error);
        await messageService.reply(from,
            "❌ *Terjadi kesalahan saat menampilkan preview!*\n\n" +
            "Silakan coba lagi atau hubungi admin jika masalah berlanjut.",
            msg
        );
    }
} 