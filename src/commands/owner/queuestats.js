import queueSystem from "../../utils/queue.js";

/**
 * Queue Stats command - Show queue statistics for monitoring
 */
async function queueStatsCommand(context) {
    const { messageService, from, msg } = context;
    
    try {
        const stats = queueSystem.getQueueStats();
        
        const statsMessage = `📊 *QUEUE STATISTICS*\n\n` +
            `📧 *Message Queue:*\n` +
            `   └ Pending: ${stats.message.pending}\n` +
            `   └ Waiting: ${stats.message.size}\n\n` +
            `📥 *Chat Upsert Queue:*\n` +
            `   └ Pending: ${stats.chatUpsert.pending}\n` +
            `   └ Waiting: ${stats.chatUpsert.size}\n\n` +
            `🖼️ *Media Queue:*\n` +
            `   └ Pending: ${stats.media.pending}\n` +
            `   └ Waiting: ${stats.media.size}\n\n` +
            `👥 *Group Queue:*\n` +
            `   └ Pending: ${stats.group.pending}\n` +
            `   └ Waiting: ${stats.group.size}\n\n` +
            `📢 *Broadcast Queue:*\n` +
            `   └ Pending: ${stats.broadcast.pending}\n` +
            `   └ Waiting: ${stats.broadcast.size}\n\n` +
            `_Timestamp: ${new Date().toLocaleString('id-ID')}_`;
        
        await messageService.reply(from, statsMessage, msg);
        
    } catch (error) {
        console.error('Queue stats error:', error);
        await messageService.sendError(from, 'general', msg);
    }
}

export default queueStatsCommand; 