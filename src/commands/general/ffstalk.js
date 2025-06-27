import { common  } from "../../index.js";
/**
 * FF Stalk command - Check Free Fire player info
 */
async function ffstalkCommand(context) {
    const { messageService, from, msg, args } = context;
    
    try {
        if (args.length === 0) {
            const usage = "Kirim perintah ffstalk id\nContoh: ffstalk 2023873618";
            return await messageService.reply(from, usage, msg);
        }

        const userId = args[0];
        
        try {
            const response = await common.fetchJson(
                `https://api.gamestoreindonesia.com/v1/order/prepare/FREEFIRE?userId=${userId}&zoneId=null`
            );

            if (response.statusCode === "404") {
                return await messageService.reply(from, "❌ ID tidak ditemukan", msg);
            }

            const nickname = response.data;
            const resultText = `*BERHASIL DITEMUKAN*\nID: ${userId}\nNickname: ${nickname}`;
            
            await messageService.reply(from, resultText, msg);
            
        } catch (error) {
            await messageService.reply(from, "❌ Gagal mengambil data. Silakan coba lagi.", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default ffstalkCommand; 