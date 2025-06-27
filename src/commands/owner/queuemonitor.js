/**
 * Queue Monitor Command - Enhanced monitoring for queue performance and timeout issues
 */

import { queueHelpers } from "../../utils/queue.js";

export default async function queueMonitor(context) {
    try {
        const { messageService, from, msg, args } = context;
        
        // Handle undefined or empty args
        if (!args || !args.length) {
            const usage = `🔧 *Queue Monitor Commands*

*Basic Monitoring:*
• \`queuemonitor stats\` - Current queue statistics
• \`queuemonitor health\` - Detailed health check
• \`queuemonitor performance\` - Performance metrics
• \`queuemonitor timeouts\` - Timeout analysis

*Management:*
• \`queuemonitor clear\` - Clear all queues
• \`queuemonitor pause\` - Pause all queues
• \`queuemonitor resume\` - Resume all queues
• \`queuemonitor emergency\` - Emergency stop
• \`queuemonitor reset\` - Reset performance metrics
• \`queuemonitor resetcircuit\` - Reset circuit breaker

*Examples:*
• \`queuemonitor stats\`
• \`queuemonitor performance\``;

            return await messageService.reply(from, usage, msg);
        }

        
        const action = args[0]?.toLowerCase();

        switch (action) {
            case 'stats':
                return await showQueueStats(context);
            case 'health':
                return await showQueueHealth(context);
            case 'performance':
                return await showPerformanceMetrics(context);
            case 'timeouts':
                return await showTimeoutAnalysis(context);
            case 'clear':
                return await clearAllQueues(context);
            case 'pause':
                return await pauseAllQueues(context);
            case 'resume':
                return await resumeAllQueues(context);
            case 'emergency':
                return await emergencyStop(context);
            case 'reset':
                return await resetMetrics(context);
            case 'resetcircuit':
                return await resetCircuitBreaker(context);
            default:
                return await messageService.reply(from, 
                    `❌ Unknown action: ${action}\n\nUse \`queuemonitor\` without arguments to see available commands.`, msg);
        }

    } catch (error) {
        console.error('Queue monitor error:', error);
        return await context.messageService.reply(context.from, 
            "❌ Gagal menjalankan queue monitor. Silakan coba lagi.", context.msg);
    }
}

async function showQueueStats(context) {
    const { messageService, from, msg } = context;
    
    try {
        const queueModule = await import("../../utils/queue.js");
        const stats = queueModule.default.getQueueStats();
        
        let statsMessage = `📊 *Queue Statistics*\n\n`;
        
        Object.entries(stats).forEach(([queueName, stat]) => {
            const statusIcon = stat.size > 20 ? '🔴' : stat.size > 10 ? '🟡' : '🟢';
            statsMessage += `${statusIcon} *${queueName.charAt(0).toUpperCase() + queueName.slice(1)} Queue*\n`;
            statsMessage += `   • Size: ${stat.size}\n`;
            statsMessage += `   • Pending: ${stat.pending}\n\n`;
        });
        
        return await messageService.reply(from, statsMessage, msg);
    } catch (error) {
        console.error('Queue stats error:', error);
        return await messageService.reply(from, "❌ Gagal mengambil statistik queue.", msg);
    }
}

async function showQueueHealth(context) {
    const { messageService, from, msg } = context;
    
    try {
        const health = await queueHelpers.healthCheck();
        
        let healthMessage = `🏥 *Queue Health Check*\n\n`;
        
        // Add circuit breaker status
        const queueModule = await import("../../utils/queue.js");
        const circuitBreakerStatus = queueModule.circuitBreaker || null;
        
        if (circuitBreakerStatus) {
            const breakerIcon = circuitBreakerStatus.isOpen ? '🔴' : '🟢';
            healthMessage += `🔌 *Circuit Breaker*\n`;
            healthMessage += `   • Status: ${breakerIcon} ${circuitBreakerStatus.isOpen ? 'OPEN (Bypass Mode)' : 'CLOSED (Normal)'}\n`;
            healthMessage += `   • Failures: ${circuitBreakerStatus.failureCount}/${circuitBreakerStatus.threshold}\n`;
            if (circuitBreakerStatus.isOpen) {
                const resetIn = Math.max(0, circuitBreakerStatus.resetTime - (Date.now() - circuitBreakerStatus.lastFailure));
                healthMessage += `   • Reset in: ${Math.ceil(resetIn / 1000)}s\n`;
            }
            healthMessage += '\n';
        }
        
        Object.entries(health).forEach(([queueName, healthData]) => {
            const statusIcon = getStatusIcon(healthData.status);
            healthMessage += `${statusIcon} *${queueName.charAt(0).toUpperCase() + queueName.slice(1)}*\n`;
            healthMessage += `   • Status: ${healthData.status}\n`;
            healthMessage += `   • Size: ${healthData.size}\n`;
            healthMessage += `   • Pending: ${healthData.pending}\n`;
            healthMessage += `   • Paused: ${healthData.isPaused ? 'Yes' : 'No'}\n`;
            healthMessage += `   • Timeout: ${healthData.config.timeout / 1000}s\n\n`;
        });
        
        return await messageService.reply(from, healthMessage, msg);
    } catch (error) {
        console.error('Queue health error:', error);
        return await messageService.reply(from, "❌ Gagal mengambil health check queue.", msg);
    }
}

async function showPerformanceMetrics(context) {
    const { messageService, from, msg } = context;
    
    try {
        const metrics = queueHelpers.getPerformanceMetrics();
        
        let performanceMessage = `📈 *Performance Metrics*\n\n`;
        performanceMessage += `⏱️ *Uptime Since:* ${new Date(metrics.uptimeSince).toLocaleString()}\n\n`;
        
        // Top operations by count
        const operations = Object.entries(metrics.operations);
        if (operations.length > 0) {
            performanceMessage += `🔢 *Top Operations by Count:*\n`;
            operations
                .sort(([,a], [,b]) => b.count - a.count)
                .slice(0, 5)
                .forEach(([key, data]) => {
                    performanceMessage += `• ${key}: ${data.count} ops (avg: ${Math.round(data.avgDuration)}ms)\n`;
                });
            performanceMessage += '\n';
        }
        
        // Slow operations
        const slowOps = Object.entries(metrics.slowOperations);
        if (slowOps.length > 0) {
            performanceMessage += `🐌 *Slow Operations (>5s):*\n`;
            slowOps.slice(0, 5).forEach(([key, ops]) => {
                const recent = ops[ops.length - 1];
                performanceMessage += `• ${key}: ${ops.length} times (last: ${Math.round(recent.duration/1000)}s)\n`;
            });
            performanceMessage += '\n';
        }
        
        // Timeouts
        const timeouts = Object.entries(metrics.timeouts);
        if (timeouts.length > 0) {
            performanceMessage += `⏰ *Timeout Errors:*\n`;
            timeouts.slice(0, 5).forEach(([key, count]) => {
                performanceMessage += `• ${key}: ${count} timeouts\n`;
            });
        } else {
            performanceMessage += `✅ *No timeout errors recorded*\n`;
        }
        
        return await messageService.reply(from, performanceMessage, msg);
    } catch (error) {
        console.error('Performance metrics error:', error);
        return await messageService.reply(from, "❌ Gagal mengambil performance metrics.", msg);
    }
}

async function showTimeoutAnalysis(context) {
    const { messageService, from, msg } = context;
    
    try {
        const metrics = queueHelpers.getPerformanceMetrics();
        
        let timeoutMessage = `⏰ *Timeout Analysis*\n\n`;
        
        const timeouts = Object.entries(metrics.timeouts);
        const slowOps = Object.entries(metrics.slowOperations);
        
        if (timeouts.length === 0) {
            timeoutMessage += `✅ *No timeout errors in current session*\n\n`;
        } else {
            timeoutMessage += `🚨 *Timeout Summary:*\n`;
            timeouts.forEach(([key, count]) => {
                timeoutMessage += `• ${key}: ${count} timeouts\n`;
            });
            timeoutMessage += '\n';
        }
        
        if (slowOps.length > 0) {
            timeoutMessage += `🐌 *Operations at Risk (>5s):*\n`;
            slowOps.forEach(([key, ops]) => {
                const avgDuration = ops.reduce((sum, op) => sum + op.duration, 0) / ops.length;
                timeoutMessage += `• ${key}: ${ops.length} slow ops (avg: ${Math.round(avgDuration/1000)}s)\n`;
            });
            timeoutMessage += '\n';
        }
        
        timeoutMessage += `💡 *Recommendations:*\n`;
        if (timeouts.length > 0) {
            timeoutMessage += `• Check server resources and network connection\n`;
            timeoutMessage += `• Consider increasing timeout values\n`;
            timeoutMessage += `• Review slow operations for optimization\n`;
        } else if (slowOps.length > 0) {
            timeoutMessage += `• Monitor slow operations closely\n`;
            timeoutMessage += `• Optimize operations taking >5 seconds\n`;
        } else {
            timeoutMessage += `• System performance is optimal\n`;
        }
        
        return await messageService.reply(from, timeoutMessage, msg);
    } catch (error) {
        console.error('Timeout analysis error:', error);
        return await messageService.reply(from, "❌ Gagal menganalisis timeout.", msg);
    }
}

async function clearAllQueues(context) {
    const { messageService, from, msg } = context;
    
    try {
        const queueModule = await import("../../utils/queue.js");
        queueModule.default.clearAllQueues();
        
        return await messageService.reply(from, "✅ Semua queue berhasil dibersihkan.", msg);
    } catch (error) {
        console.error('Clear queues error:', error);
        return await messageService.reply(from, "❌ Gagal membersihkan queue.", msg);
    }
}

async function pauseAllQueues(context) {
    const { messageService, from, msg } = context;
    
    try {
        const queueModule = await import("../../utils/queue.js");
        queueModule.default.pauseAllQueues();
        
        return await messageService.reply(from, "⏸️ Semua queue berhasil dijeda.", msg);
    } catch (error) {
        console.error('Pause queues error:', error);
        return await messageService.reply(from, "❌ Gagal menjeda queue.", msg);
    }
}

async function resumeAllQueues(context) {
    const { messageService, from, msg } = context;
    
    try {
        const queueModule = await import("../../utils/queue.js");
        queueModule.default.resumeAllQueues();
        
        return await messageService.reply(from, "▶️ Semua queue berhasil dilanjutkan.", msg);
    } catch (error) {
        console.error('Resume queues error:', error);
        return await messageService.reply(from, "❌ Gagal melanjutkan queue.", msg);
    }
}

async function emergencyStop(context) {
    const { messageService, from, msg } = context;
    
    try {
        const queueModule = await import("../../utils/queue.js");
        queueModule.default.emergencyStop();
        
        return await messageService.reply(from, "🛑 Emergency stop berhasil dilakukan. Semua queue dihentikan dan dibersihkan.", msg);
    } catch (error) {
        console.error('Emergency stop error:', error);
        return await messageService.reply(from, "❌ Gagal melakukan emergency stop.", msg);
    }
}

async function resetMetrics(context) {
    const { messageService, from, msg } = context;
    
    try {
        queueHelpers.resetPerformanceMetrics();
        
        return await messageService.reply(from, "🔄 Performance metrics berhasil direset.", msg);
    } catch (error) {
        console.error('Reset metrics error:', error);
        return await messageService.reply(from, "❌ Gagal mereset metrics.", msg);
    }
}

async function resetCircuitBreaker(context) {
    const { messageService, from, msg } = context;
    
    try {
        const { circuitBreaker } = await import("../../utils/queue.js");
        
        const wasOpen = circuitBreaker.isOpen;
        circuitBreaker.isOpen = false;
        circuitBreaker.failureCount = 0;
        circuitBreaker.lastFailure = 0;
        
        const statusMessage = wasOpen 
            ? "🔄 Circuit breaker berhasil direset dari status OPEN ke CLOSED. Queue operations restored!"
            : "🔄 Circuit breaker direset (sudah dalam status CLOSED).";
        
        return await messageService.reply(from, statusMessage, msg);
    } catch (error) {
        console.error('Reset circuit breaker error:', error);
        return await messageService.reply(from, "❌ Gagal mereset circuit breaker.", msg);
    }
}

function getStatusIcon(status) {
    switch (status) {
        case 'healthy': return '🟢';
        case 'busy': return '🟡';
        case 'warning': return '🟠';
        case 'critical': return '🔴';
        case 'paused': return '⏸️';
        default: return '⚪';
    }
} 