import fs from "fs";

/**
 * Hapuslist command - Delete all list items for the group
 */
async function hapuslistCommand(context) {
    const { messageService, listManager, from, msg, args } = context;
    
    try {
        if (!args[0] || args[0].toLowerCase() !== 'confirm') {
            return await messageService.reply(from, 
                `Perintah ini akan menghapus SEMUA list di group ini!\n\nUntuk konfirmasi, ketik: hapuslist confirm`, msg);
        }
        
        const db_respon_list = listManager.getListDb();
        
        if (!listManager.isAlreadyResponListGroup(from, db_respon_list)) {
            return await messageService.reply(from, `Tidak ada list di group ini`, msg);
        }
        
        // Remove all list items for this group
        const updatedList = db_respon_list.filter(item => item.id !== from);
        listManager.saveListDb ? listManager.saveListDb(updatedList) : fs.writeFileSync('./database/list.json', JSON.stringify(updatedList, null, 3));
        
        await messageService.reply(from, `Berhasil menghapus semua list di group ini`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'hapuslist', msg);
    }
}

export default hapuslistCommand; 