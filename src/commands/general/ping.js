import config from "../../config/settings.js";

function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Ping command - Check bot status and uptime
 */
async function pingCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        const uptime = runtime(process.uptime());
        const responseText = `${config.bot.botName} Sudah Online Selama : ${uptime}`;
        
        await messageService.reply(from, responseText, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'general', msg);
    }
}

export default pingCommand; 