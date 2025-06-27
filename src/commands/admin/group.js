import moment from "moment-timezone";

/**
 * Group command - Open/close group
 */
async function groupCommand(context) {
    const { messageService, groupService, from, msg, args } = context;
    
    try {
        if (!args[0]) {
            return await messageService.reply(from, 
                `Kirim perintah group _options_\nOptions : close & open\nContoh : group close`, msg);
        }

        const jam = moment.tz("asia/jakarta").format("HH:mm:ss");
        const tanggal = moment().tz("Asia/Jakarta").format("ll");
        const day = moment().tz("Asia/Jakarta").format("dddd");
        
        if (args[0] === "close") {
            // Close the group (only admins can send messages)
            await groupService.closeGroup(from);
            await messageService.reply(from, 
                `*Sorry we are closed see you tomorrow 🫶🏻 and thank you for today all 🙏🏻*\n\n> 📆 DATE : ${day} ${tanggal}\n> ⌚ TIME : ${jam}`, msg);
                
        } else if (args[0] === "open") {
            // Open the group (all members can send messages)
            await groupService.openGroup(from);
            await messageService.reply(from, 
                `*Kita sudah OPEN ya silahkan ketik list untuk melihat daftar menu yang tersedia 🔥*\n\n> 📆 DATE : ${day} ${tanggal}\n> ⌚ TIME : ${jam}`, msg);
                
        } else {
            await messageService.reply(from, 
                `Kirim perintah group _options_\nOptions : close & open\nContoh : group close`, msg);
        }
        
    } catch (error) {
        console.log(error);
        await messageService.sendError(from, 'group', msg);
    }
}

export default groupCommand; 