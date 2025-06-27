import { common  } from "../../index.js";
/**
 * ML Stalk command - Check Mobile Legends player info
 */
async function mlstalkCommand(context) {
    const { messageService, from, msg, args, fullArgs } = context;
    
    try {
        if (args.length < 2) {
            const usage = "Kirim perintah mlstalk id|zone\nContoh: mlstalk 106281329|2228";
            return await messageService.reply(from, usage, msg);
        }

        if (!fullArgs.includes("|")) {
            const usage = "Format salah! Gunakan: mlstalk id|zone\nContoh: mlstalk 106281329|2228";
            return await messageService.reply(from, usage, msg);
        }

        const [userId, zoneId] = fullArgs.split("|");
        
        if (!userId || !zoneId) {
            const usage = "ID dan Zone ID wajib diisi!\nContoh: mlstalk 106281329|2228";
            return await messageService.reply(from, usage, msg);
        }

        try {
            const response = await common.fetchJson(
                `https://api.gamestoreindonesia.com/v1/order/prepare/MOBILE_LEGENDS?userId=${userId.trim()}&zoneId=${zoneId.trim()}`
            );

            if (response.statusCode === "404") {
                return await messageService.reply(from, "❌ ID/Zone tidak ditemukan", msg);
            }

            const nickname = response.data;
            const resultText = `*BERHASIL DITEMUKAN*\nID: ${userId.trim()}\nZone: ${zoneId.trim()}\nNickname: ${nickname}`;
            
            await messageService.reply(from, resultText, msg);
            
        } catch (error) {
            await messageService.reply(from, "❌ Gagal mengambil data. Silakan coba lagi.", msg);
        }
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default mlstalkCommand; 