/**
 * Queue System for Message Processing
 * Manages concurrent message handling with rate limiting to prevent WhatsApp bans
 */

import PQueue from 'p-queue';

// Main message processing queue - for text messages and commands
const messageQueue = new PQueue({
    concurrency: 3,        // Max 3 messages at once
    interval: 1000,        // Per second
    intervalCap: 8,        // Max 8 messages per second
    timeout: 30000,        // 30 second timeout
    throwOnTimeout: true
});

// Chat upsert operations queue - for incoming message processing
const chatUpsertQueue = new PQueue({
    concurrency: 5,        // Can process multiple incoming messages
    interval: 500,         // Every 500ms
    intervalCap: 20,       // Max 20 operations per 500ms
    timeout: 15000,        // 15 second timeout
    throwOnTimeout: true
});

// Media processing queue - slower for heavy operations (images, videos, documents)
const mediaQueue = new PQueue({
    concurrency: 1,        // One media at a time to avoid memory issues
    interval: 2000,        // Every 2 seconds
    intervalCap: 3,        // Max 3 media per 2 seconds
    timeout: 60000,        // 60 second timeout for large files
    throwOnTimeout: true
});

// Group operations queue - for group management (kick, promote, settings)
const groupQueue = new PQueue({
    concurrency: 2,        // Max 2 group operations at once
    interval: 1500,        // Every 1.5 seconds
    intervalCap: 4,        // Max 4 group operations per 1.5 seconds
    timeout: 20000,        // 20 second timeout
    throwOnTimeout: true
});

// Broadcast queue - for sending messages to multiple chats
const broadcastQueue = new PQueue({
    concurrency: 1,        // One broadcast at a time
    interval: 3000,        // Every 3 seconds
    intervalCap: 1,        // Max 1 broadcast per 3 seconds
    timeout: 45000,        // 45 second timeout
    throwOnTimeout: true
});

// Add error handling for all queues
const queues = [messageQueue, chatUpsertQueue, mediaQueue, groupQueue, broadcastQueue];

queues.forEach((queue, index) => {
    const queueNames = ['message', 'chatUpsert', 'media', 'group', 'broadcast'];
    const queueName = queueNames[index];
    
    queue.on('error', (error) => {
        console.error(`[${queueName}Queue] Error:`, error);
    });
    
    queue.on('idle', () => {
        console.log(`[${queueName}Queue] All tasks completed, queue is idle`);
    });
    
    // Log queue stats every minute for monitoring
    setInterval(() => {
        if (queue.size > 0 || queue.pending > 0) {
            console.log(`[${queueName}Queue] Stats: Size=${queue.size}, Pending=${queue.pending}`);
        }
    }, 60000);
});

export {
    messageQueue,
    chatUpsertQueue,
    mediaQueue,
    groupQueue,
    broadcastQueue
};

export default {
    messageQueue,
    chatUpsertQueue,
    mediaQueue,
    groupQueue,
    broadcastQueue,
    
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
        queues.forEach(queue => queue.clear());
    },
    
    // Pause all queues
    pauseAllQueues: () => {
        queues.forEach(queue => queue.pause());
    },
    
    // Resume all queues
    resumeAllQueues: () => {
        queues.forEach(queue => queue.start());
    }
}; 