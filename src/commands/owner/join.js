import { common  } from "../../index.js";

/**
 * Join command - Join group via invite link
 */
async function joinCommand(context) {
    const { ramz, messageService, from, msg, fullArgs } = context;
    
    try {
        if (!fullArgs) {
            return await messageService.reply(from, `Kirim perintah join _linkgrup_`, msg);
        }
        
        const ini_urrrl = fullArgs.split("https://chat.whatsapp.com/")[1];
        
        if (!ini_urrrl) {
            return await messageService.reply(from, `Link grup tidak valid`, msg);
        }
        
        try {
            await ramz.groupAcceptInvite(ini_urrrl);
            await messageService.reply(from, `Berhasil Join ke grup...`, msg);
        } catch (error) {
            await messageService.reply(from, `Eror.. Mungkin bot telah di kick dari grup tersebut`, msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'join', msg);
    }
}

export default joinCommand; 