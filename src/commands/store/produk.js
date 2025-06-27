/**
 * Produk command - Show product list
 */
async function produkCommand(context) {
    const { messageService, produkManager, from, msg, sender } = context;
    
    try {
        const db_respon_produk = produkManager.getProdukDb();
        
        if (db_respon_produk.length === 0) {
            return await messageService.reply(from, `Belum ada list produk di database`, msg);
        }
        
        let teks = `Hi @${sender.split("@")[0]}\nBerikut list produk\n\n`;
        
        for (let x of db_respon_produk) {
            teks += `*LIST PRODUK:* ${x.key}\n\n`;
        }
        
        teks += `_Ingin melihat listnya?_\n_Ketik List Produk yang ada di atas_`;
        
        await messageService.sendMessage(from, {
            text: teks,
            mentions: [sender]
        }, { quoted: msg });
        
    } catch (error) {
        await messageService.sendError(from, 'produk', msg);
    }
}

export default produkCommand; 