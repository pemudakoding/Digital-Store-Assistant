# 📊 Monitoring & Health System

KoalaStore Bot v2.0.0 dilengkapi dengan comprehensive monitoring dan health system yang memungkinkan real-time tracking bot performance, queue statistics, dan automatic diagnostics.

## 🎯 Overview

Sistem monitoring ini dirancang untuk:
- **Real-time Health Monitoring** - Track bot health secara real-time
- **Performance Metrics** - Monitor response time, memory usage, dan throughput
- **Queue Statistics** - Monitor semua queue system untuk prevent bottlenecks
- **Error Tracking** - Track command errors dan failure patterns
- **Emergency Recovery** - Tools untuk quick recovery dari masalah critical

## 📊 Health Monitoring Commands

### `botstat` Command

Command untuk comprehensive bot health monitoring yang hanya bisa diakses oleh owner.

#### Usage
```
botstat
```

#### Features
- **Health Score** - Calculated dari 0-100% berdasarkan berbagai metrics
- **Queue Statistics** - Real-time monitoring semua queue (message, media, group, broadcast)
- **Memory Usage** - RSS, Heap Used, External memory tracking
- **Command Statistics** - Execution count, error tracking per command
- **Connection Status** - Bot connectivity dan service health
- **Uptime Tracking** - Bot uptime dalam minutes

#### Health Score Calculation
```javascript
// Base score 100%
let healthScore = 100;

// Queue health penalties
queueHealth.forEach(queue => {
    if (queue.status === 'warning') healthScore -= 10;
    if (queue.isPaused) healthScore -= 20;
});

// Message service health
if (messageHealth.status === 'unhealthy') healthScore -= 30;
```

#### Health Status Indicators
- **🟢 Excellent (90-100%)** - Semua systems normal
- **🟡 Good (70-89%)** - Minor issues, masih operational
- **🟠 Warning (50-69%)** - Ada masalah yang perlu attention
- **🔴 Critical (<50%)** - Serious issues, perlu immediate action

### `resetqueue` Command

Emergency command untuk bot recovery yang bisa clear semua queues dan reset state.

#### Usage
```
resetqueue
```

#### Features
- **Queue Clearing** - Clear semua pending operations di queue
- **Rate Limit Reset** - Reset semua rate limiting counters
- **Memory Cleanup** - Force garbage collection
- **State Reset** - Reset internal bot state
- **Detailed Reporting** - Report semua actions yang dilakukan

#### Use Cases
- Bot stuck atau not responding
- Queue overflow dari spam attack
- Memory leak detection
- Performance degradation
- After major error incidents

## 🔄 Queue System Monitoring

### Queue Types

Bot menggunakan beberapa queue untuk different operations:

#### 1. **Message Queue**
- **Purpose**: Process incoming messages sequentially
- **Timeout**: 15 seconds (reduced dari 30s)
- **Monitoring**: Pending operations, queue size, processing rate

#### 2. **Chat Upsert Queue**
- **Purpose**: Handle chat updates dan state changes
- **Timeout**: 10 seconds (reduced dari 15s)
- **Monitoring**: Update frequency, success rate

#### 3. **Media Queue**
- **Purpose**: Process media uploads, downloads, conversions
- **Timeout**: 45 seconds (reduced dari 60s)
- **Monitoring**: Media processing time, file sizes

#### 4. **Group Queue**
- **Purpose**: Handle group operations (welcome, kick, etc.)
- **Timeout**: 15 seconds (reduced dari 20s)
- **Monitoring**: Group operation success rate

#### 5. **Broadcast Queue**
- **Purpose**: Handle mass message broadcasting
- **Timeout**: 30 seconds (reduced dari 45s)
- **Monitoring**: Broadcast success rate, delivery time

### Queue Health Status

#### Healthy Queue
```
✅ Queue Size: 0/100
✅ Pending: 0 operations
✅ Status: Active
✅ Last Operation: <1s ago
```

#### Warning Queue
```
🟡 Queue Size: 75/100
⚠️ Pending: 15 operations
🔄 Status: Active (High Load)
⏰ Last Operation: 5s ago
```

#### Critical Queue
```
🔴 Queue Size: 100/100
❌ Pending: 50+ operations
⛔ Status: Paused/Stuck
🚨 Last Operation: >30s ago
```

## 📈 Performance Metrics

### Response Time Monitoring

Bot tracks response time untuk semua operations:

```javascript
// Command execution time
const startTime = performance.now();
await executeCommand();
const executionTime = performance.now() - startTime;

// Update statistics
commandStats[commandName].executionTime.push(executionTime);
commandStats[commandName].avgResponseTime = calculateAverage(executionTime);
```

### Memory Usage Tracking

```javascript
const memUsage = process.memoryUsage();
// RSS: Resident Set Size - total memory
// HeapUsed: Memory used by objects
// External: C++ objects bound to JS objects
```

### Error Rate Monitoring

```javascript
// Track errors per command
commandStats[commandName].errors++;
commandStats[commandName].errorRate = 
    (errors / totalExecutions) * 100;
```

## 🚨 Alerting & Thresholds

### Automatic Health Checks

Bot melakukan automatic health checks setiap 30 detik:

```javascript
setInterval(() => {
    const health = checkBotHealth();
    if (health.score < 50) {
        logger.error('Critical health detected', health);
        // Trigger recovery procedures
    }
}, 30000);
```

### Threshold Values

#### Queue Size Thresholds
- **Normal**: 0-50 items
- **Warning**: 51-75 items  
- **Critical**: 76+ items

#### Response Time Thresholds
- **Fast**: <500ms
- **Normal**: 500ms-2s
- **Slow**: 2s-5s
- **Critical**: >5s

#### Memory Thresholds
- **Normal**: <512MB
- **Warning**: 512MB-1GB
- **Critical**: >1GB

## 🔧 Troubleshooting dengan Monitoring

### Common Issues & Solutions

#### 1. **High Queue Size**
```bash
# Check queue status
botstat

# If critical, reset queues
resetqueue

# Monitor recovery
botstat
```

#### 2. **High Memory Usage**
```bash
# Check memory usage
botstat

# Force garbage collection via reset
resetqueue

# Restart if needed
npm run pm2:restart
```

#### 3. **Slow Response Time**
```bash
# Check for stuck operations
botstat

# Reset if needed
resetqueue

# Check for command errors
botstat | grep "ERROR COMMANDS"
```

#### 4. **Bot Not Responding**
```bash
# Emergency recovery sequence
resetqueue

# If still stuck, restart
npm run pm2:restart

# Monitor recovery
npm run pm2:logs
```

## 🛠️ Advanced Monitoring Setup

### Custom Health Checks

Anda bisa menambah custom health checks:

```javascript
// src/utils/healthCheck.js
export function customHealthCheck() {
    return {
        database: checkDatabaseHealth(),
        external_apis: checkExternalAPIs(),
        session: checkSessionHealth(),
        custom_metrics: checkCustomMetrics()
    };
}
```

### Monitoring Integration

#### PM2 Monitoring
```bash
# Real-time monitoring
pm2 monit

# CPU dan memory usage
pm2 status

# Logs dengan timestamps
pm2 logs --timestamp
```

#### External Monitoring Tools

Bot expose health endpoint untuk external monitoring:

```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
    const health = await getBotHealth();
    res.json({
        status: health.score > 50 ? 'healthy' : 'unhealthy',
        score: health.score,
        details: health
    });
});
```

## 📊 Monitoring Dashboard

### Real-time Metrics

Contoh output dari `botstat`:

```
🤖 BOT STATUS REPORT

🟢 Overall Health: Excellent (95%)
⏰ Uptime: 1440 minutes

📊 QUEUE STATISTICS
┌─ Message Queue: 2/100
├─ Chat Upsert: 0/50
├─ Media Queue: 1/25
├─ Group Queue: 0/30
└─ Broadcast: 0/10

🔌 CONNECTION STATUS
┌─ Message Service: ✅ healthy
└─ Bot ID: 628xxxx@s.whatsapp.net

💾 MEMORY USAGE
┌─ RSS: 245.67 MB
├─ Heap Used: 89.34 MB
└─ External: 12.45 MB

📈 COMMAND STATISTICS
Total Commands: 45
Active Commands: 32

✅ No command errors detected

🕐 Last Updated: 27/06/2025, 15:30:45
```

### Performance Trends

Monitor performance trends over time:

```javascript
// Track daily averages
const dailyStats = {
    avgResponseTime: calculateDailyAverage(responseTimes),
    errorRate: calculateDailyErrorRate(),
    queueUtilization: calculateQueueUtilization(),
    memoryUsage: calculateMemoryTrends()
};
```

## 🎯 Best Practices

### 1. **Regular Monitoring**
- Check `botstat` minimal 2x sehari untuk production bots
- Monitor queue trends untuk detect patterns
- Track error rates untuk identify problematic commands

### 2. **Proactive Maintenance**
- Reset queues weekly untuk prevent accumulation
- Monitor memory usage trends
- Update timeout values berdasarkan performance data

### 3. **Emergency Procedures**
- Keep `resetqueue` command handy untuk emergencies
- Have restart procedures documented
- Monitor logs setelah incidents

### 4. **Performance Optimization**
- Use monitoring data untuk optimize command timeouts
- Identify dan optimize slow commands
- Monitor external API performance

## 🔗 Related Documentation

- **[Commands Guide](./07-commands.md)** - Complete command list
- **[Architecture Overview](./05-architecture.md)** - System architecture
- **[Troubleshooting](./18-troubleshooting.md)** - General troubleshooting
- **[PM2 Deployment](./15-pm2-deployment.md)** - Production deployment

---

**💡 Tip**: Regular monitoring adalah key untuk maintaining high bot availability dan performance. Use `botstat` command regularly dan setup alerts untuk critical thresholds. 