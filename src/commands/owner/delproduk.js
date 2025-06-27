/**
 * Delproduk command - Delete existing product
 */
async function delprodukCommand(context) {
    const { messageService, produkManager, from, msg, fullArgs } = context;
    
    try {
        const db_respon_produk = produkManager.getProdukDb();
        
        if (db_respon_produk.length === 0) {
            return await messageService.reply(from, `Belum ada list produk di database`, msg);
        }
        
        if (!fullArgs) {
            return await messageService.reply(from, 
                `Gunakan dengan cara delproduk *key*\n\n_Contoh_\n\ndelproduk diamond_ml`, msg);
        }
        
        if (!produkManager.isAlreadyResponProduk(fullArgs, db_respon_produk)) {
            return await messageService.reply(from, `List produk dengan key *${fullArgs}* tidak ada di database!`, msg);
        }
        
        produkManager.delResponProduk(fullArgs, db_respon_produk);
        await messageService.reply(from, `Sukses delete list produk dengan key *${fullArgs}*`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'delproduk', msg);
    }
}

export default delprodukCommand; 