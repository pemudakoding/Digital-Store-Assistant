import { common  } from "../../index.js";
/**
 * Delsetdone command - Delete done template
 */
async function delsetdoneCommand(context) {
    const { messageService, templateManager, from, msg } = context;
    
    try {
        const set_done = templateManager.getSetDoneDb();
        
        if (!templateManager.isAlreadySetDone(from, "done", set_done)) {
            return await messageService.reply(from, `Belum ada set done di group ini`, msg);
        }
        
        templateManager.delResponSetDone(from, "done", set_done);
        await messageService.reply(from, `Sukses delete set done`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'delsetdone', msg);
    }
}

export default delsetdoneCommand; 