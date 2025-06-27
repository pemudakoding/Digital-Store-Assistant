/**
 * Revoke command - Revoke group invite link
 */
async function revokeCommand(context) {
    const { ramz, messageService, from, msg } = context;
    
    try {
        await ramz.groupRevokeInvite(from);
        await messageService.reply(from, `Sukses menyetel tautan undangan grup ini`, msg);
        
    } catch (error) {
        await messageService.sendError(from, 'revoke', msg);
    }
}

export default revokeCommand; 