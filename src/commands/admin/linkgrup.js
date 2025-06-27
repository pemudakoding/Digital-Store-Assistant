/**
 * Linkgrup command - Get group invite link
 */
async function linkgrupCommand(context) {
    const { client, messageService, from, msg } = context;
    
    try {
        const url = await client.groupInviteCode(from);
        const inviteLink = "https://chat.whatsapp.com/" + url;
        
        await messageService.reply(from, inviteLink, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'linkgrup', msg);
    }
}

export default linkgrupCommand; 