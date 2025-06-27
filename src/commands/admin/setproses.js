import { common  } from "../../index.js";
/**
 * Setproses command - Set custom processing message template
 */
async function setprosesCommand(context) {
    const { messageService, templateManager, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, 
                `Gunakan dengan cara setproses teks\n\n_Contoh_\n\nsetproses pesanan @pesan, tag orang @nama`, msg);
        }
        
        const set_proses = templateManager.getSetProsesDb();
        
        if (templateManager.isAlreadySetProses(from, "proses", set_proses)) {
            return await messageService.reply(from, `Set proses already active`, msg);
        }
        
        templateManager.addResponSetProses(from, "proses", fullArgs, set_proses);
        await messageService.reply(from, `Sukses set proses!`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'setproses', msg);
    }
}

export default setprosesCommand; 