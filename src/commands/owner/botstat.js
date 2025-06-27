import queueSystem from "../../utils/queue.js";

/**
 * Bot Status command - Comprehensive bot health monitoring
 */
async function botStatCommand(context) {
    const { messageService, from, msg, services } = context;
    
    try {
        // Get queue statistics
        const queueStats = queueSystem.getQueueStats();
        const queueHealth = queueSystem.getQueueHealth();
        
        // Get message service health
        const messageHealth = await services.messageService.healthCheck();
        
        // Get command statistics if available
        const commandStats = context.commandHandler?.getCommandStats?.() || {};
        
        // Calculate overall health score
        let healthScore = 100;
        Object.values(queueHealth).forEach(queue => {
            if (queue.status === 'warning') healthScore -= 10;
            if (queue.isPaused) healthScore -= 20;
        });
        
        if (messageHealth.status === 'unhealthy') healthScore -= 30;
        
        // Determine health status
        let healthStatus;
        let healthEmoji;
        if (healthScore >= 90) {
            healthStatus = 'Excellent';
            healthEmoji = '🟢';
        } else if (healthScore >= 70) {
            healthStatus = 'Good';
            healthEmoji = '🟡';
        } else if (healthScore >= 50) {
            healthStatus = 'Warning';
            healthEmoji = '🟠';
        } else {
            healthStatus = 'Critical';
            healthEmoji = '🔴';
        }
        
        // Get memory usage
        const memUsage = process.memoryUsage();
        const formatBytes = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
        };
        
        // Get top error commands
        const errorCommands = Object.entries(commandStats)
            .filter(([name, stats]) => stats.errors > 0)
            .sort((a, b) => b[1].errors - a[1].errors)
            .slice(0, 3);
        
        const statsMessage = 
`🤖 *BOT STATUS REPORT*

${healthEmoji} *Overall Health:* ${healthStatus} (${healthScore}%)
⏰ *Uptime:* ${Math.floor(process.uptime() / 60)} minutes

📊 *QUEUE STATISTICS*
┌─ Message Queue: ${queueStats.message.pending}/${queueStats.message.size}
├─ Chat Upsert: ${queueStats.chatUpsert.pending}/${queueStats.chatUpsert.size}
├─ Media Queue: ${queueStats.media.pending}/${queueStats.media.size}
├─ Group Queue: ${queueStats.group.pending}/${queueStats.group.size}
└─ Broadcast: ${queueStats.broadcast.pending}/${queueStats.broadcast.size}

🔌 *CONNECTION STATUS*
┌─ Message Service: ${messageHealth.status === 'healthy' ? '✅' : '❌'} ${messageHealth.status}
└─ Bot ID: ${messageHealth.botId || 'Unknown'}

💾 *MEMORY USAGE*
┌─ RSS: ${formatBytes(memUsage.rss)}
├─ Heap Used: ${formatBytes(memUsage.heapUsed)}
└─ External: ${formatBytes(memUsage.external)}

📈 *COMMAND STATISTICS*
Total Commands: ${Object.keys(commandStats).length}
Active Commands: ${Object.values(commandStats).filter(s => s.executions > 0).length}

${errorCommands.length > 0 ? `⚠️ *TOP ERROR COMMANDS*\n${errorCommands.map(([name, stats]) => `• ${name}: ${stats.errors} errors`).join('\n')}` : '✅ No command errors detected'}

🕐 *Last Updated:* ${new Date().toLocaleString('id-ID')}`;

        await messageService.reply(from, statsMessage, msg);
        
    } catch (error) {
        console.error('Bot stats error:', error);
        await messageService.reply(from, "❌ Gagal mengambil statistik bot. Silakan coba lagi.", msg);
    }
}

export default botStatCommand; 