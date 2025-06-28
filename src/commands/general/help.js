import config from "../../config/settings.js";

/**
 * Help command - Display bot menu
 */
async function helpCommand(context) {
    const { messageService, from, msg, sender } = context;
    
    try {
        const menu = `━━━━━[ ${config.bot.botName} ]━━━━━


┏━━━『 𝘿𝘼𝙏𝘼 𝘽𝙊𝙏 』━━━━━◧
┃
┣» ᴄʀᴇᴀᴛᴏʀ : @${config.bot.kontakOwner}
┣» ʙᴏᴛ ɴᴀᴍᴇ : ${config.bot.botName}
┣» ᴏᴡɴᴇʀ ɴᴀᴍᴇ : ${config.bot.ownerName}
┣» ʀᴜɴɴɪɴɢ : ᴘᴀɴᴇʟ
┃
┗━◧


┏           『 𝙇𝙞𝙨𝙩 𝙈𝙚𝙣𝙪 』           ◧

⭔ allmenu       ⭐
⭔ testi
⭔ produk
⭔ kalkulator
⭔ script
⭔ owner
⭔ donasi
⭔ ffstalk
⭔ mlstalk

┗━◧`;

        await messageService.reply(from, menu, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default helpCommand; 