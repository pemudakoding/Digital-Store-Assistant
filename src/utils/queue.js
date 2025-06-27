/**
 * Queue System for Message Processing
 * Manages concurrent message handling with rate limiting to prevent WhatsApp bans
 */

import PQueue from 'p-queue';
import logger from './logger.js';

// Main message processing queue - for text messages and commands
const messageQueue = new PQueue({
    concurrency: 3,        // Max 3 messages at once
    interval: 1000,        // Per second
    intervalCap: 8,        // Max 8 messages per second
    timeout: 15000,        // Reduced to 15 second timeout (from 30)
    throwOnTimeout: true
});

// Chat upsert operations queue - for incoming message processing
const chatUpsertQueue = new PQueue({
    concurrency: 5,        // Can process multiple incoming messages
    interval: 500,         // Every 500ms
    intervalCap: 20,       // Max 20 operations per 500ms
    timeout: 10000,        // Reduced to 10 second timeout (from 15)
    throwOnTimeout: true
});

// Media processing queue - slower for heavy operations (images, videos, documents)
const mediaQueue = new PQueue({
    concurrency: 1,        // One media at a time to avoid memory issues
    interval: 2000,        // Every 2 seconds
    intervalCap: 3,        // Max 3 media per 2 seconds
    timeout: 45000,        // Reduced to 45 second timeout (from 60)
    throwOnTimeout: true
});

// Group operations queue - for group management (kick, promote, settings)
const groupQueue = new PQueue({
    concurrency: 2,        // Max 2 group operations at once
    interval: 1500,        // Every 1.5 seconds
    intervalCap: 4,        // Max 4 group operations per 1.5 seconds
    timeout: 15000,        // Reduced to 15 second timeout (from 20)
    throwOnTimeout: true
});

// Broadcast queue - for sending messages to multiple chats
const broadcastQueue = new PQueue({
    concurrency: 1,        // One broadcast at a time
    interval: 3000,        // Every 3 seconds
    intervalCap: 1,        // Max 1 broadcast per 3 seconds
    timeout: 30000,        // Reduced to 30 second timeout (from 45)
    throwOnTimeout: true
});

// Add error handling for all queues
const queues = [messageQueue, chatUpsertQueue, mediaQueue, groupQueue, broadcastQueue];

queues.forEach((queue, index) => {
    const queueNames = ['message', 'chatUpsert', 'media', 'group', 'broadcast'];
    const queueName = queueNames[index];
    
    queue.on('error', (error) => {
        logger.error(`[${queueName}Queue] Error:`, error);
        
        // Auto-retry for certain types of errors
        if (error.message?.includes('timeout') || error.message?.includes('connection')) {
            logger.warn(`[${queueName}Queue] Auto-retrying after error...`);
        }
    });
    
    queue.on('idle', () => {
        logger.debug(`[${queueName}Queue] All tasks completed, queue is idle`);
    });
    
    // Enhanced queue monitoring
    queue.on('add', () => {
        if (queue.size > 10) {
            logger.warn(`[${queueName}Queue] High queue size detected: ${queue.size}`);
        }
    });
    
    // Log queue stats every 30 seconds for better monitoring
    setInterval(() => {
        if (queue.size > 0 || queue.pending > 0) {
            logger.info(`[${queueName}Queue] Stats: Size=${queue.size}, Pending=${queue.pending}`);
        }
        
        // Clear stuck queues if they become too large
        if (queue.size > 50) {
            logger.warn(`[${queueName}Queue] Queue too large (${queue.size}), clearing...`);
            queue.clear();
        }
    }, 30000);
});

// Enhanced queue helper functions
const queueHelpers = {
    // Retry function with exponential backoff
    async retryOperation(operation, maxRetries = 3, baseDelay = 1000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) {
                    logger.error(`Operation failed after ${maxRetries} attempts:`, error);
                    throw error;
                }
                
                const delay = baseDelay * Math.pow(2, attempt - 1);
                logger.warn(`Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError;
    },
    
    // Safe queue add with timeout handling
    async safeAdd(queue, operation, fallback = null) {
        try {
            return await queue.add(operation);
        } catch (error) {
            logger.error('Queue operation failed:', error);
            
            if (fallback && typeof fallback === 'function') {
                logger.info('Executing fallback operation...');
                return await fallback();
            }
            
            throw error;
        }
    }
};

export {
    messageQueue,
    chatUpsertQueue,
    mediaQueue,
    groupQueue,
    broadcastQueue,
    queueHelpers
};

export default {
    messageQueue,
    chatUpsertQueue,
    mediaQueue,
    groupQueue,
    broadcastQueue,
    queueHelpers,
    
    // Legacy compatibility
    queue: messageQueue,
    queueUpsertChat: chatUpsertQueue,
    
    // Helper functions
    getQueueStats: () => {
        return {
            message: { size: messageQueue.size, pending: messageQueue.pending },
            chatUpsert: { size: chatUpsertQueue.size, pending: chatUpsertQueue.pending },
            media: { size: mediaQueue.size, pending: mediaQueue.pending },
            group: { size: groupQueue.size, pending: groupQueue.pending },
            broadcast: { size: broadcastQueue.size, pending: broadcastQueue.pending }
        };
    },
    
    // Clear all queues (for emergency stop)
    clearAllQueues: () => {
        logger.warn('Clearing all queues...');
        queues.forEach(queue => queue.clear());
    },
    
    // Pause all queues
    pauseAllQueues: () => {
        logger.warn('Pausing all queues...');
        queues.forEach(queue => queue.pause());
    },
    
    // Resume all queues
    resumeAllQueues: () => {
        logger.info('Resuming all queues...');
        queues.forEach(queue => queue.start());
    },
    
    // Health check for queues
    getQueueHealth: () => {
        const health = {};
        const queueNames = ['message', 'chatUpsert', 'media', 'group', 'broadcast'];
        
        queues.forEach((queue, index) => {
            const name = queueNames[index];
            health[name] = {
                size: queue.size,
                pending: queue.pending,
                isPaused: queue.isPaused,
                status: queue.size > 20 ? 'warning' : 'healthy'
            };
        });
        
        return health;
    }
}; 