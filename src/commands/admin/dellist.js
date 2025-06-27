/**
 * Dellist command - Delete list item by key
 */
async function dellistCommand(context) {
    const { messageService, listManager, from, msg, args } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, 
                `Gunakan dengan cara dellist *key*\n\n_Contoh_\n\ndellist diamondml`, msg);
        }
        
        const key = args[0];
        const listData = listManager.getListDb();
        
        if (!listManager.isAlreadyResponList(from, key, listData)) {
            return await messageService.reply(from, `List dengan key *${key}* tidak ada di group ini`, msg);
        }
        
        listManager.delResponList(from, key, listData);
        await messageService.reply(from, `Berhasil delete list dengan key *${key}*`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'dellist', msg);
    }
}

export default dellistCommand; 