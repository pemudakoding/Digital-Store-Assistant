/**
 * List command - Display available products (Group only)
 */
export default async function listCommand(context) {
    const { from, msg, messageService, listManager, sender, day, date, time, isGroup } = context;
    
    // Check if command is used in group
    if (!isGroup) {
        const creativeMessage = `🚫 *Ups! Command Tersesat* 🚫\n\n` +
            `Maaf kak @${sender.split("@")[0]}, command *list* ini khusus untuk grup saja! 🏠\n\n` +
            `📝 *Kenapa harus di grup?*\n` +
            `• Supaya semua member bisa lihat produk\n` +
            `• Lebih interaktif dan transparan\n` +
            `• Biar rame diskusinya! 🎉\n\n` +
            `💡 *Solusi:* Gunakan command ini di grup ya kak!`;
        
        return await messageService.sendMentions(from, creativeMessage, [sender], { quoted: msg });
    }
    
    try {
        // Get all list data and filter by group ID
        const allListData = listManager.getListDb();
        const listData = allListData.filter(item => item.id === from);
        
        if (listData.length === 0) {
            return await messageService.reply(from, "Belum ada list produk yang tersedia di grup ini.", msg);
        }

        // Create formatted response similar to index.js style
        let responseText = `*Hai* @${sender.split("@")[0]}\n\n`;
        
        // Convert to Indonesian date format
        const indonesianDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const now = new Date();
        const dayName = indonesianDays[now.getDay()];
        const dayNumber = now.getDate();
        const monthName = indonesianMonths[now.getMonth()];
        const year = now.getFullYear();
        const indonesianDate = `${dayName}, ${dayNumber} ${monthName} ${year}`;
        
        responseText += `*── .✦ 𝖣𝖺𝗍𝖾 : ${indonesianDate}*\n`;
        responseText += `*── .✦ 𝖳𝗂𝗆𝖾 : ${time}*\n\n`;
        responseText += `*╭─────✧ [ LIST PRODUK ]*\n`;

        // Sort products alphabetically and add to the list
        listData
            .sort((a, b) => a.key.toLowerCase().localeCompare(b.key.toLowerCase()))
            .forEach((item, index) => {
                const status = item.isClose ? "*「CLOSED」*" : "";
                responseText += `*│»* *${item.key.toUpperCase()}* ${status}\n`;
            });

        responseText += `*│*\n`;
        responseText += `*╰───────✧*\n\n`;
        responseText += `Untuk melihat detail produk silahkan kirim nama produk yang ada pada list di atas.\n`;
        responseText += `💳 *Ketik payment untuk info pembayaran*`;

        await messageService.sendMentions(from, responseText, [sender], { quoted: msg });
        
    } catch (error) {
        console.log(error)
        await messageService.sendError(from, 'general', msg);
    }
} 