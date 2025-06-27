/**
 * Fitnah command - Create fake messages from other users
 */
async function fitnahCommand(context) {
    const { messageService, from, msg, fullArgs, mentioned } = context;
    
    try {
        if (!fullArgs.includes("|")) {
            return await messageService.reply(from, 
                `Kirim perintah fitnah @tag|pesantarget|pesanbot`, msg);
        }
        
        const parts = fullArgs.split("|");
        const org = parts[0];
        const target = parts[1];
        const bot = parts[2];
        
        if (!org.startsWith("@")) {
            return await messageService.reply(from, "Tag orangnya", msg);
        }
        
        if (!target) {
            return await messageService.reply(from, `Masukkan pesan target!`, msg);
        }
        
        if (!bot) {
            return await messageService.reply(from, `Masukkan pesan bot!`, msg);
        }
        
        // Parse mentions from target message
        const parseMention = (text = "") => {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(
                (v) => v[1] + "@s.whatsapp.net",
            );
        };
        
        const mens = parseMention(target);
        const orgNumber = parseMention(org)[0];
        
        // Create fake message context
        const msg1 = {
            key: {
                fromMe: false,
                participant: orgNumber,
                remoteJid: from
            },
            message: {
                extendedTextMessage: {
                    text: target,
                    contextInfo: { mentionedJid: mens }
                }
            }
        };
        
        const msg2 = {
            key: {
                fromMe: false,
                participant: orgNumber,
                remoteJid: from
            },
            message: { conversation: target }
        };
        
        await messageService.sendMessage(from, {
            text: bot,
            mentions: mentioned
        }, { quoted: mens.length > 2 ? msg1 : msg2 });
        
    } catch (error) {
        await messageService.sendError(from, 'fitnah', msg);
    }
}

export default fitnahCommand; 