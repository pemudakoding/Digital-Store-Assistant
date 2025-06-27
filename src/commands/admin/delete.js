/**
 * Delete command - Delete bot's messages
 */
async function deleteCommand(context) {
    const { client, messageService, from, msg, quotedMsg } = context;
    
    try {
        if (!quotedMsg) {
            return await messageService.reply(from, `Balas chat dari bot yang ingin dihapus`, msg);
        }
        
        if (!quotedMsg.fromMe) {
            return await messageService.reply(from, `Hanya bisa menghapus chat dari bot`, msg);
        }
        
        await client.sendMessage(from, {
            delete: { 
                fromMe: true, 
                id: quotedMsg.id, 
                remoteJid: from 
            }
        });
        
    } catch (error) {
        await messageService.sendError(from, 'delete', msg);
    }
}

export default deleteCommand; 