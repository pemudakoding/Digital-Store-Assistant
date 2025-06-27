# ⚡ Quick PM2 Setup for KoalaStore Bot

Fast setup guide for running KoalaStore Bot with PM2 on Windows.

## 🚀 1-Minute Setup

### Step 1: Install PM2
```bash
npm install -g pm2
```

### Step 2: Start Bot
```bash
npm run pm2:start
```

### Step 3: Check Status
```bash
npm run pm2:status
```

### Step 4: View Logs
```bash
npm run pm2:logs
```

**🎉 Done! Your bot is now running in production mode.**

## 🎯 Essential Commands

| Action | Command | Description |
|--------|---------|-------------|
| **Start** | `npm run pm2:start` | Start bot with PM2 |
| **Stop** | `npm run pm2:stop` | Stop the bot |
| **Restart** | `npm run pm2:restart` | Restart the bot |
| **Reload** | `npm run pm2:reload` | Zero-downtime reload |
| **Status** | `npm run pm2:status` | Check bot status |
| **Logs** | `npm run pm2:logs` | View live logs |
| **Delete** | `npm run pm2:delete` | Remove from PM2 |

## 🪟 Windows Easy Mode

Use the provided batch script for Windows:

```cmd
# Setup (first time only)
pm2-windows.bat setup

# Start bot  
pm2-windows.bat start

# Check status
pm2-windows.bat status

# View logs
pm2-windows.bat logs

# Clean session if needed
pm2-windows.bat clean
```

## 🔧 Auto-Start on Boot

```bash
# Save current processes
pm2 save

# Setup auto-start
pm2 startup

# Follow the instructions shown
```

## 📱 Getting QR Code in Production

```bash
# Watch logs for QR code
npm run pm2:logs

# Look for the QR code in terminal output
# Scan with WhatsApp: Settings → Linked Devices → Link a Device
```

## 🚨 Quick Troubleshooting

**Bot won't start?**
```bash
pm2 delete koalastore-bot
npm run pm2:start
```

**Session issues?**
```bash
npm run pm2:stop
npm run clean
npm run pm2:start
```

**Memory issues?**
```bash
npm run pm2:restart
```

**See detailed logs?**
```bash
npm run pm2:logs --lines 50
```

## 💡 Pro Tips

- Use `npm run pm2:reload` for zero-downtime updates
- Monitor with `pm2 monit` for real-time stats
- Set up log rotation: `pm2 install pm2-logrotate`
- Use `npm run logs:clear` to clear old logs

---

**📖 For complete guide:** [PM2-DEPLOYMENT.md](PM2-DEPLOYMENT.md)  
**🐛 Need help?** Check [Troubleshooting](.docs/14-troubleshooting.md) 