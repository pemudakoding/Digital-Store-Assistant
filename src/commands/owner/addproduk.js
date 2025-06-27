import fs from "fs";
import { ImageUploadService } from "node-upload-images";

/**
 * Addproduk command - Add new product with image
 */
async function addprodukCommand(context) {
    const { messageService, produkManager, from, msg, fullArgs, isImage, isQuotedImage, sender, mediaService } = context;
    
    try {
        if (!fullArgs.includes("@")) {
            return await messageService.reply(from, 
                `Gunakan dengan cara addproduk *key@response*\n\n_Contoh_\n\naddproduk produk1@deskripsi produk`, msg);
        }
        
        if (!isImage && !isQuotedImage) {
            return await messageService.reply(from, 
                `Kirim gambar dengan caption addproduk *key@response* atau reply gambar yang sudah ada dengan caption addproduk *key@response*`, msg);
        }
        
        const args1 = fullArgs.split("@")[0];
        const args2 = fullArgs.split("@")[1];
        
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
        produkManager.addResponProduk(args1, args2, true, tphurl, db_respon_produk);
        
        await messageService.reply(from, `Berhasil menambah List produk *${args1}*`, msg);
        
        if (fs.existsSync(media)) {
            fs.unlinkSync(media);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'addproduk', msg);
    }
}

export default addprodukCommand; 