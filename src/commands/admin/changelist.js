/**
 * Changelist command - Change list item content
 */
async function changelistCommand(context) {
    const { messageService, listManager, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs.includes('>')) {
            return await messageService.reply(from, 
                `Gunakan dengan cara changelist *key@response*\n\n_Contoh_\n\nchangelist produk1@deskripsi baru`, msg);
        }
        
        const args1 = fullArgs.split(">")[0];
        const args2 = fullArgs.split(">")[1];
        
        const db_respon_list = listManager.getListDb();
        
        if (!listManager.isAlreadyResponList(from, args1, db_respon_list)) {
            return await messageService.reply(from, `List dengan key *${args1}* tidak ada di group ini`, msg);
        }
        
        listManager.updateResponListKey(from, args1, args2, db_respon_list);
        await messageService.reply(from, `Berhasil update list dengan key *${args1}*`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'changelist', msg);
    }
}

export default changelistCommand; 