/**
 * Testi command - Show testimonial list
 */
export default async function testiCommand(context) {
    const { messageService, testiManager, from, msg, sender } = context;
    
    try {
        const db_respon_testi = testiManager.getTestiDb();
        
        if (db_respon_testi.length === 0) {
            return await messageService.reply(from, `Belum ada list testi di database`, msg);
        }
        
        let teks = `Hi @${sender.split("@")[0]}\nBerikut list testi\n\n`;
        
        for (let x of db_respon_testi) {
            teks += `*LIST TESTI:* ${x.key}\n\n`;
        }
        
        teks += `_Ingin melihat listnya?_\n_Ketik List Testi yang ada di atas_`;
        
        await messageService.sendMessage(from, {
            text: teks,
            mentions: [sender]
        }, { quoted: msg });
        
    } catch (error) {
        await messageService.sendError(from, 'testi', msg);
    }
} 