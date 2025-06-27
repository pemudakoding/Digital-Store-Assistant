 import queueSystem from "../../utils/queue.js";
import logger from "../../utils/logger.js";

/**
 * Reset Queue command - Clear all queues and reset bot responsiveness
 */
async function resetQueueCommand(context) {
    const { messageService, from, msg, services } = context;
    
    try {
        // Get queue stats before reset
        const statsBefore = queueSystem.getQueueStats();
        
        const beforeMessage = 
`🔄 *RESETTING BOT QUEUES...*

📊 *QUEUE STATUS BEFORE RESET:*
┌─ Message Queue: ${statsBefore.message.pending}/${statsBefore.message.size}
├─ Chat Upsert: ${statsBefore.chatUpsert.pending}/${statsBefore.chatUpsert.size}
├─ Media Queue: ${statsBefore.media.pending}/${statsBefore.media.size}
├─ Group Queue: ${statsBefore.group.pending}/${statsBefore.group.size}
└─ Broadcast: ${statsBefore.broadcast.pending}/${statsBefore.broadcast.size}

⏳ *Processing reset...*`;

        await messageService.reply(from, beforeMessage, msg);
        
        // Clear all queues
        queueSystem.clearAllQueues();
        logger.warn('Queues cleared by admin command');
        
        // Clear message service rate limiting
        if (services.messageService.clearRateLimit) {
            services.messageService.clearRateLimit();
        }
        
        // Force garbage collection if available
        if (global.gc) {
            global.gc();
            logger.info('Garbage collection executed');
        }
        
        // Wait a moment for queues to clear
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Resume all queues
        queueSystem.resumeAllQueues();
        
        // Get queue stats after reset
        const statsAfter = queueSystem.getQueueStats();
        
        const afterMessage = 
`✅ *QUEUE RESET COMPLETED*

📊 *QUEUE STATUS AFTER RESET:*
┌─ Message Queue: ${statsAfter.message.pending}/${statsAfter.message.size}
├─ Chat Upsert: ${statsAfter.chatUpsert.pending}/${statsAfter.chatUpsert.size}
├─ Media Queue: ${statsAfter.media.pending}/${statsAfter.media.size}
├─ Group Queue: ${statsAfter.group.pending}/${statsAfter.group.size}
└─ Broadcast: ${statsAfter.broadcast.pending}/${statsAfter.broadcast.size}

🔄 *Actions Performed:*
• ✅ All queues cleared
• ✅ Rate limits reset
• ✅ Memory cleanup ${global.gc ? '(with GC)' : '(no GC available)'}
• ✅ Queues resumed

🤖 *Bot should now be more responsive!*
💡 Use *botstat* to monitor ongoing health.

🕐 *Completed at:* ${new Date().toLocaleString('id-ID')}`;

        await messageService.reply(from, afterMessage, msg);
        
        logger.info('Queue reset completed successfully by admin');
        
    } catch (error) {
        logger.error('Reset queue error:', error);
        await messageService.reply(from, "❌ Gagal mereset queue. Silakan restart bot secara manual.", msg);
    }
}

export default resetQueueCommand; 