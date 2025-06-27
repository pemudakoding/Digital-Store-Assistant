import { common  } from "../../index.js";
/**
 * Delsetproses command - Delete proses template
 */
async function delsetprosesCommand(context) {
    const { messageService, templateManager, from, msg } = context;
    
    try {
        const set_proses = templateManager.getSetProsesDb();
        
        if (!templateManager.isAlreadySetProses(from, "proses", set_proses)) {
            return await messageService.reply(from, `Belum ada set proses di group ini`, msg);
        }
        
        templateManager.delResponSetProses(from, "proses", set_proses);
        await messageService.reply(from, `Sukses delete set proses`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'delsetproses', msg);
    }
}

export default delsetprosesCommand; 