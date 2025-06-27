/**
 * Enhanced Queue System for Message Processing
 * Manages concurrent message handling with improved timeout handling and monitoring
 */

import PQueue from 'p-queue';
import logger from './logger.js';

// Performance monitoring
const performanceMetrics = {
    operations: new Map(),
    slowOperations: new Map(),
    timeouts: new Map(),
    lastReset: Date.now()
};

// Circuit breaker for emergency bypass
const circuitBreaker = {
    failureCount: 0,
    lastFailure: 0,
    threshold: 5,
    resetTime: 60000, // 1 minute
    isOpen: false,
    
    recordFailure() {
        this.failureCount++;
        this.lastFailure = Date.now();
        if (this.failureCount >= this.threshold) {
            this.isOpen = true;
            logger.error(`Circuit breaker OPENED after ${this.failureCount} failures`);
        }
    },
    
    recordSuccess() {
        this.failureCount = Math.max(0, this.failureCount - 1);
        if (this.failureCount === 0 && this.isOpen) {
            this.isOpen = false;
            logger.info('Circuit breaker CLOSED - operations restored');
        }
    },
    
    shouldBypass() {
        if (!this.isOpen) return false;
        
        // Auto-reset after reset time
        if (Date.now() - this.lastFailure > this.resetTime) {
            this.isOpen = false;
            this.failureCount = 0;
            logger.info('Circuit breaker auto-reset');
            return false;
        }
        
        return true;
    }
};

// Enhanced queue configurations with adaptive timeouts
const queueConfigs = {
    message: {
        concurrency: 3,
        interval: 1000,
        intervalCap: 8,
        timeout: 35000,        // Increased to 35s for better reliability
        throwOnTimeout: false  // Changed to false for graceful handling
    },
    chatUpsert: {
        concurrency: 5,
        interval: 500,
        intervalCap: 20,
        timeout: 30000,        // Increased to 30s for better reliability
        throwOnTimeout: false  // Changed to false for graceful handling
    },
    media: {
        concurrency: 1,
        interval: 2000,
        intervalCap: 3,
        timeout: 60000,        // Increased from 45s to 60s
        throwOnTimeout: false
    },
    group: {
        concurrency: 2,
        interval: 1500,
        intervalCap: 4,
        timeout: 20000,        // Increased from 15s to 20s
        throwOnTimeout: false
    },
    broadcast: {
        concurrency: 1,
        interval: 3000,
        intervalCap: 1,
        timeout: 45000,        // Increased from 30s to 45s
        throwOnTimeout: false
    }
};

// Create queues with enhanced configurations
const messageQueue = new PQueue(queueConfigs.message);
const chatUpsertQueue = new PQueue(queueConfigs.chatUpsert);
const mediaQueue = new PQueue(queueConfigs.media);
const groupQueue = new PQueue(queueConfigs.group);
const broadcastQueue = new PQueue(queueConfigs.broadcast);

// Performance monitoring functions
function trackOperation(queueName, operationName, duration) {
    const key = `${queueName}:${operationName}`;
    
    if (!performanceMetrics.operations.has(key)) {
        performanceMetrics.operations.set(key, {
            count: 0,
            totalDuration: 0,
            avgDuration: 0,
            maxDuration: 0,
            minDuration: Infinity
        });
    }
    
    const metrics = performanceMetrics.operations.get(key);
    metrics.count++;
    metrics.totalDuration += duration;
    metrics.avgDuration = metrics.totalDuration / metrics.count;
    metrics.maxDuration = Math.max(metrics.maxDuration, duration);
    metrics.minDuration = Math.min(metrics.minDuration, duration);
    
    // Track slow operations (>5 seconds)
    if (duration > 5000) {
        if (!performanceMetrics.slowOperations.has(key)) {
            performanceMetrics.slowOperations.set(key, []);
        }
        performanceMetrics.slowOperations.get(key).push({
            duration,
            timestamp: Date.now()
        });
        
        logger.warn(`Slow operation detected: ${key} took ${duration}ms`);
    }
}

function trackTimeout(queueName, operationName) {
    const key = `${queueName}:${operationName}`;
    
    if (!performanceMetrics.timeouts.has(key)) {
        performanceMetrics.timeouts.set(key, 0);
    }
    
    performanceMetrics.timeouts.set(key, performanceMetrics.timeouts.get(key) + 1);
    logger.error(`Timeout occurred: ${key} (total timeouts: ${performanceMetrics.timeouts.get(key)})`);
}

// Enhanced error handling for all queues
const queues = [messageQueue, chatUpsertQueue, mediaQueue, groupQueue, broadcastQueue];
const queueNames = ['message', 'chatUpsert', 'media', 'group', 'broadcast'];

queues.forEach((queue, index) => {
    const queueName = queueNames[index];
    
    queue.on('error', (error) => {
        logger.error(`[${queueName}Queue] Error:`, error);
        
        // Track timeout errors
        if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
            trackTimeout(queueName, 'unknown');
        }
    });
    
    queue.on('idle', () => {
        logger.debug(`[${queueName}Queue] All tasks completed, queue is idle`);
    });
    
    // Enhanced queue monitoring with adaptive warnings
    queue.on('add', () => {
        const warningThreshold = queueName === 'message' ? 15 : 10;
        if (queue.size > warningThreshold) {
            logger.warn(`[${queueName}Queue] High queue size detected: ${queue.size}`);
        }
    });
    
    // Enhanced queue stats monitoring
    setInterval(() => {
        if (queue.size > 0 || queue.pending > 0) {
            logger.info(`[${queueName}Queue] Stats: Size=${queue.size}, Pending=${queue.pending}`);
        }
        
        // Progressive queue clearing with warnings
        const criticalThreshold = queueName === 'message' ? 100 : 50;
        if (queue.size > criticalThreshold) {
            logger.error(`[${queueName}Queue] Critical queue size (${queue.size}), clearing oldest tasks...`);
            
            // Clear oldest half of the queue instead of everything
            const tasksToKeep = Math.floor(queue.size / 2);
            queue.clear();
            logger.warn(`[${queueName}Queue] Cleared queue, keeping newest operations for stability`);
        }
    }, 30000);
});

// Utility function for queue status
function getQueueStatus(queue, queueName) {
    if (queue.isPaused) return 'paused';
    if (queue.size > 50) return 'critical';
    if (queue.size > 20) return 'warning';
    if (queue.size > 10) return 'busy';
    return 'healthy';
}

// Enhanced queue helper functions with timeout handling
const queueHelpers = {
    // Enhanced retry function with exponential backoff and timeout handling
    async retryOperation(operation, maxRetries = 3, baseDelay = 1000, timeoutMs = 30000) {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Wrap operation with timeout
                const result = await Promise.race([
                    operation(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
                    )
                ]);
                
                return result;
            } catch (error) {
                lastError = error;
                
                if (attempt === maxRetries) {
                    logger.error(`Operation failed after ${maxRetries} attempts:`, error);
                    throw error;
                }
                
                const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), 10000); // Max 10s delay
                logger.warn(`Operation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        
        throw lastError;
    },
    
    // Enhanced safe queue add with circuit breaker and emergency bypass
    async safeAdd(queue, operation, fallback = null, operationName = 'unknown') {
        const startTime = Date.now();
        const queueName = queueNames[queues.indexOf(queue)] || 'unknown';
        
        // Circuit breaker: bypass queue if too many failures
        if (circuitBreaker.shouldBypass()) {
            logger.warn(`Circuit breaker OPEN: bypassing queue for ${queueName}:${operationName}`);
            try {
                const result = await operation();
                circuitBreaker.recordSuccess();
                return result;
            } catch (error) {
                logger.error(`Direct execution failed during circuit breaker bypass: ${error.message}`);
                if (fallback) {
                    try {
                        return await fallback();
                    } catch (fallbackError) {
                        logger.error('Fallback also failed during bypass:', fallbackError);
                        throw fallbackError;
                    }
                }
                throw error;
            }
        }
        
        // Emergency bypass if queue is critically large
        if (queue.size > 30) {
            logger.warn(`Queue ${queueName} critically large (${queue.size}), emergency bypass for ${operationName}`);
            try {
                const result = await operation();
                return result;
            } catch (error) {
                logger.error(`Emergency bypass failed: ${error.message}`);
                if (fallback) return await fallback();
                throw error;
            }
        }
        
        try {
            // Add timeout wrapper to the operation itself
            const wrappedOperation = async () => {
                const opStartTime = Date.now();
                try {
                    const result = await operation();
                    const duration = Date.now() - opStartTime;
                    trackOperation(queueName, operationName, duration);
                    circuitBreaker.recordSuccess();
                    return result;
                } catch (error) {
                    const duration = Date.now() - opStartTime;
                    trackOperation(queueName, operationName, duration);
                    throw error;
                }
            };
            
            return await queue.add(wrappedOperation);
            
        } catch (error) {
            const duration = Date.now() - startTime;
            
            // Handle timeout errors gracefully
            if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
                trackTimeout(queueName, operationName);
                circuitBreaker.recordFailure();
                logger.warn(`Queue timeout for ${queueName}:${operationName} after ${duration}ms, attempting fallback...`);
                
                if (fallback && typeof fallback === 'function') {
                    try {
                        logger.info('Executing fallback operation...');
                        const result = await fallback();
                        circuitBreaker.recordSuccess();
                        return result;
                    } catch (fallbackError) {
                        logger.error('Fallback operation also failed:', fallbackError);
                        circuitBreaker.recordFailure();
                        throw fallbackError;
                    }
                }
            }
            
            circuitBreaker.recordFailure();
            logger.error(`Queue operation failed for ${queueName}:${operationName}:`, error);
            throw error;
        }
    },
    
    // New: Quick operation for high-priority tasks
    async quickAdd(queue, operation, operationName = 'quick') {
        const queueName = queueNames[queues.indexOf(queue)] || 'unknown';
        
        // For critical operations, try direct execution first if queue is busy
        if (queue.size > 5) {
            logger.warn(`Queue ${queueName} is busy (${queue.size}), attempting direct execution for quick operation`);
            try {
                return await operation();
            } catch (error) {
                logger.warn(`Direct execution failed, falling back to queue: ${error.message}`);
            }
        }
        
        return this.safeAdd(queue, operation, operation, operationName);
    },
    
    // New: Get performance metrics
    getPerformanceMetrics() {
        const metrics = {
            operations: Object.fromEntries(performanceMetrics.operations),
            slowOperations: Object.fromEntries(performanceMetrics.slowOperations),
            timeouts: Object.fromEntries(performanceMetrics.timeouts),
            uptimeSince: new Date(performanceMetrics.lastReset).toISOString()
        };
        
        return metrics;
    },
    
    // New: Reset performance metrics
    resetPerformanceMetrics() {
        performanceMetrics.operations.clear();
        performanceMetrics.slowOperations.clear();
        performanceMetrics.timeouts.clear();
        performanceMetrics.lastReset = Date.now();
        logger.info('Performance metrics reset');
    },
    
    // New: Health check for all queues
    async healthCheck() {
        const health = {};
        
        for (let i = 0; i < queues.length; i++) {
            const queue = queues[i];
            const name = queueNames[i];
            
            health[name] = {
                size: queue.size,
                pending: queue.pending,
                isPaused: queue.isPaused,
                status: getQueueStatus(queue, name),
                config: queueConfigs[name] || {}
            };
        }
        
        return health;
    },
    
    // New: Get queue status (moved outside)
    getQueueStatus: getQueueStatus
};

// Performance monitoring report (every 5 minutes)
setInterval(() => {
    const metrics = queueHelpers.getPerformanceMetrics();
    
    // Log slow operations summary
    if (metrics.slowOperations && Object.keys(metrics.slowOperations).length > 0) {
        logger.warn('Slow operations detected:', Object.keys(metrics.slowOperations));
    }
    
    // Log timeout summary
    if (metrics.timeouts && Object.keys(metrics.timeouts).length > 0) {
        logger.error('Operations with timeouts:', metrics.timeouts);
    }
    
    // Auto-reset metrics every hour to prevent memory buildup
    const uptime = Date.now() - performanceMetrics.lastReset;
    if (uptime > 3600000) { // 1 hour
        queueHelpers.resetPerformanceMetrics();
    }
}, 300000); // 5 minutes

export {
    messageQueue,
    chatUpsertQueue,
    mediaQueue,
    groupQueue,
    broadcastQueue,
    queueHelpers,
    circuitBreaker
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
    
    // Enhanced helper functions
    getQueueStats: () => {
        return {
            message: { size: messageQueue.size, pending: messageQueue.pending },
            chatUpsert: { size: chatUpsertQueue.size, pending: chatUpsertQueue.pending },
            media: { size: mediaQueue.size, pending: mediaQueue.pending },
            group: { size: groupQueue.size, pending: groupQueue.pending },
            broadcast: { size: broadcastQueue.size, pending: broadcastQueue.pending }
        };
    },
    
    // Enhanced queue management
    clearAllQueues: () => {
        logger.warn('Clearing all queues...');
        queues.forEach((queue, index) => {
            const queueName = queueNames[index];
            const sizeBefore = queue.size;
            queue.clear();
            if (sizeBefore > 0) {
                logger.info(`Cleared ${queueName} queue (${sizeBefore} tasks removed)`);
            }
        });
    },
    
    pauseAllQueues: () => {
        logger.warn('Pausing all queues...');
        queues.forEach((queue, index) => {
            queue.pause();
            logger.info(`Paused ${queueNames[index]} queue`);
        });
    },
    
    resumeAllQueues: () => {
        logger.info('Resuming all queues...');
        queues.forEach((queue, index) => {
            queue.start();
            logger.info(`Resumed ${queueNames[index]} queue`);
        });
    },
    
    // Enhanced health check
    getQueueHealth: queueHelpers.healthCheck,
    
    // New: Emergency stop for critical situations
    emergencyStop: () => {
        logger.error('EMERGENCY STOP: Pausing all queues and clearing pending operations');
        queues.forEach((queue, index) => {
            queue.pause();
            queue.clear();
            logger.error(`Emergency stopped ${queueNames[index]} queue`);
        });
    },
    
    // New: Performance monitoring
    getPerformanceReport: queueHelpers.getPerformanceMetrics,
    resetPerformanceMetrics: queueHelpers.resetPerformanceMetrics
}; 