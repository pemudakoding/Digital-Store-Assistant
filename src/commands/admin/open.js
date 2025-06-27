/**
 * Open command - Set list item status to open
 */
async function openCommand(context) {
    const { messageService, listManager, from, msg, args } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, 
                `Gunakan dengan cara open *key*\n\n_Contoh_\n\nopen diamondml`, msg);
        }
        
        const key = args[0];
        const db_respon_list = listManager.getListDb();
        
        if (!listManager.isAlreadyResponList(from, key, db_respon_list)) {
            return await messageService.reply(from, `List dengan key *${key}* tidak ada di group ini`, msg);
        }
        
        listManager.updateListStatus(from, key, false, db_respon_list);
        await messageService.reply(from, `Berhasil buka list dengan key *${key}*`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'open', msg);
    }
}

export default openCommand; 