# 🚀 PM2 Deployment Guide for KoalaStore Bot

This guide explains how to deploy and manage KoalaStore Bot using PM2 for production environments.

## 📋 Prerequisites

### 1. Install PM2 Globally
```bash
npm install -g pm2
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Logs Directory
```bash
mkdir -p logs
```

## 🚀 Quick Start with PM2

### 1. Start Bot with PM2
```bash
npm run pm2:start
# or directly
pm2 start ecosystem.config.js
```

### 2. Check Status
```bash
npm run pm2:status
# or
pm2 status
```

### 3. View Logs
```bash
npm run pm2:logs
# or
pm2 logs koalastore-bot
```

## 📖 Complete PM2 Commands Reference

### 🎯 Application Management

| Command | NPM Script | Direct PM2 | Description |
|---------|------------|------------|-------------|
| **Start** | `npm run pm2:start` | `pm2 start ecosystem.config.js` | Start the bot |
| **Stop** | `npm run pm2:stop` | `pm2 stop koalastore-bot` | Stop the bot |
| **Restart** | `npm run pm2:restart` | `pm2 restart koalastore-bot` | Hard restart |
| **Reload** | `npm run pm2:reload` | `pm2 reload koalastore-bot` | Zero-downtime reload |
| **Delete** | `npm run pm2:delete` | `pm2 delete koalastore-bot` | Remove from PM2 |

### 📊 Monitoring & Logs

| Command | NPM Script | Direct PM2 | Description |
|---------|------------|------------|-------------|
| **Status** | `npm run pm2:status` | `pm2 status` | Show all processes |
| **Logs** | `npm run pm2:logs` | `pm2 logs koalastore-bot` | View live logs |
| **Monitor** | `npm run pm2:monit` | `pm2 monit` | Real-time monitoring |
| **Clear Logs** | `npm run logs:clear` | `rm -rf logs/*` | Clear log files |

### 🔧 Advanced Operations

```bash
# Start with specific environment
pm2 start ecosystem.config.js --env development
pm2 start ecosystem.config.js --env production

# View specific log files
pm2 logs koalastore-bot --lines 50
pm2 logs koalastore-bot --err      # Only errors
pm2 logs koalastore-bot --out      # Only output

# Flush logs
pm2 flush koalastore-bot

# Save PM2 process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Start PM2 on system boot
pm2 startup
```

## ⚙️ Configuration Details

### 📄 Ecosystem Configuration (`ecosystem.config.js`)

The bot is configured with the following settings:

```javascript
{
  name: 'koalastore-bot',           // Process name
  script: 'src/app.js',           // Entry point (non-interactive)
  instances: 1,                   // Single instance
  exec_mode: 'fork',             // Fork mode
  autorestart: true,             // Auto restart on crash
  max_memory_restart: '1G',      // Restart if memory > 1GB
  restart_delay: 5000,           // Wait 5s before restart
  min_uptime: '10s',             // Min uptime before considered started
  max_restarts: 10               // Max restart attempts
}
```

### 🌍 Environment Variables

**Production Environment:**
```javascript
env: {
  NODE_ENV: 'production',
  TZ: 'Asia/Jakarta',
  NODE_NO_WARNINGS: '1'
}
```

**Development Environment:**
```javascript
env_development: {
  NODE_ENV: 'development',
  TZ: 'Asia/Jakarta'
}
```

### 📝 Logging Configuration

Logs are stored in the `logs/` directory:

- **Combined logs**: `logs/combined.log`
- **Output logs**: `logs/out.log`
- **Error logs**: `logs/error.log`

Log format includes timestamps: `YYYY-MM-DD HH:mm:ss Z`

## 🔄 Auto-Start on System Boot

### 1. Generate Startup Script
```bash
pm2 startup
```

### 2. Save Current Process List
```bash
pm2 save
```

### 3. Test Restart
```bash
sudo reboot
# After reboot, check if bot is running
pm2 status
```

## 📊 Production Deployment Workflow

### 1. Initial Setup
```bash
# Clone repository
git clone https://github.com/yourusername/KoalaStore.git
cd KoalaStore

# Install dependencies
npm install

# Create logs directory
mkdir -p logs

# Install PM2 globally
npm install -g pm2
```

### 2. First Start
```bash
# Start with PM2
npm run pm2:start

# Check status
npm run pm2:status

# View logs to ensure it's working
npm run pm2:logs
```

### 3. Updates & Maintenance
```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Reload bot (zero-downtime)
npm run pm2:reload

# Or restart if major changes
npm run pm2:restart
```

## 🛡️ Production Best Practices

### 🔒 Security
- Run bot as non-root user
- Set proper file permissions
- Use environment variables for sensitive data
- Enable firewall for server protection

### 📈 Performance
- Monitor memory usage regularly
- Set appropriate memory limits
- Use log rotation to prevent disk space issues
- Monitor CPU usage during peak times

### 🔧 Maintenance
```bash
# Daily log rotation (add to crontab)
0 0 * * * pm2 flush koalastore-bot

# Weekly restart (optional)
0 2 * * 0 pm2 restart koalastore-bot

# Monitor disk space
df -h

# Check bot status
pm2 status
```

## 🚨 Troubleshooting

### ❌ Common Issues

#### Bot Won't Start
```bash
# Check PM2 logs
pm2 logs koalastore-bot --lines 50

# Check if port is in use
netstat -tulpn | grep :3000

# Restart with force
pm2 delete koalastore-bot
npm run pm2:start
```

#### High Memory Usage
```bash
# Check memory usage
pm2 monit

# Restart to clear memory
npm run pm2:restart

# Adjust memory limit in ecosystem.config.js
max_memory_restart: '512M'  # Lower limit
```

#### Session Issues
```bash
# Stop bot
npm run pm2:stop

# Clean session
npm run clean

# Restart bot
npm run pm2:start
```

#### Log File Issues
```bash
# Clear all logs
npm run logs:clear

# Flush PM2 logs
pm2 flush koalastore-bot

# Restart logging
npm run pm2:restart
```

### 🔍 Debugging

#### Enable Debug Mode
```bash
# Start in development mode
pm2 start ecosystem.config.js --env development

# View detailed logs
pm2 logs koalastore-bot --lines 100
```

#### Check System Resources
```bash
# System overview
htop

# Disk usage
df -h

# Memory usage
free -h

# PM2 resource usage
pm2 monit
```

## 📱 WhatsApp Session Management

### 🔄 Session Handling in Production

The bot automatically handles sessions:

1. **Valid Session**: Keeps existing session
2. **Corrupted Session**: Auto-cleans and creates new session
3. **No Session**: Creates new session and shows QR code in logs

### 📱 Getting QR Code in Production

```bash
# Watch logs for QR code
npm run pm2:logs

# Look for QR code output in terminal
# Use WhatsApp to scan the QR code
```

### ⚠️ Session Backup (Recommended)

```bash
# Backup session before updates
cp -r sessionn sessionn_backup

# Restore if needed
rm -rf sessionn
mv sessionn_backup sessionn
```

## 🎯 Performance Monitoring

### 📊 Built-in Monitoring
```bash
# Real-time monitoring dashboard
npm run pm2:monit

# Process status
npm run pm2:status

# Log monitoring
tail -f logs/combined.log
```

### 📈 Advanced Monitoring (Optional)

#### PM2 Plus (Official Monitoring)
```bash
# Register for PM2 Plus
pm2 plus

# Link your server
pm2 link <secret_key> <public_key>
```

#### Custom Health Checks
```bash
# Add to crontab for health checks
*/5 * * * * curl -f http://localhost:3000/health || pm2 restart koalastore-bot
```

## 🔄 Zero-Downtime Deployment

For production updates without interrupting service:

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Reload (zero-downtime)
npm run pm2:reload

# 4. Verify status
npm run pm2:status
```

## 📞 Support

If you encounter issues:

1. **Check logs**: `npm run pm2:logs`
2. **Check status**: `npm run pm2:status`
3. **Restart bot**: `npm run pm2:restart`
4. **Clear session**: `npm run clean` then restart

For additional help, refer to:
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [KoalaStore Bot Documentation](README.md)
- [GitHub Issues](https://github.com/yourusername/KoalaStore/issues)

---

**🎉 Your KoalaStore Bot is now running in production with PM2!** 