import fs from "fs";
/**
 * Delete testimonial command
 */
export default async function delTestiCommand(context) {
    const { messageService, testiManager, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from,
                "Masukkan nama testimonial yang ingin dihapus\n\nContoh: deltesti netflix",
                msg
            );
        }

        const db_respon_testi = testiManager.getTestiDb();
        
        if (db_respon_testi.length === 0) {
            return await messageService.reply(from, `Belum ada list testi di database`, msg);
        }

        if (!testiManager.isAlreadyResponTesti(fullArgs, db_respon_testi)) {
            return await messageService.reply(from, `List testi dengan key *${fullArgs}* tidak ada di database!`, msg);
        }

        testiManager.delResponTesti(fullArgs, db_respon_testi);
        
        await messageService.reply(from, `Sukses delete list testi dengan key *${fullArgs}*`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
} 