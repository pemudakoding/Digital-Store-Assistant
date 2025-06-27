import { common  } from "../../index.js";
/**
 * Setdone command - Set custom completion message template
 */
async function setdoneCommand(context) {
    const { messageService, templateManager, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, 
                `Gunakan dengan cara setdone *teks_done*\n\n_Contoh_\n\nsetdone pesanan @pesan, tag orang @nama\n\nList Opts : tanggal/jamwib`, msg);
        }
        
        const set_done = templateManager.getSetDoneDb();
        
        if (templateManager.isAlreadySetDone(from, "done", set_done)) {
            return await messageService.reply(from, `Set done already active`, msg);
        }
        
        templateManager.addResponSetDone(from, "done", fullArgs, set_done);
        await messageService.reply(from, `Successfully set done!`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'setdone', msg);
    }
}

export default setdoneCommand; 