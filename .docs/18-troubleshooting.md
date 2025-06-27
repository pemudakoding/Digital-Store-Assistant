# 🔧 Troubleshooting Guide

Panduan mengatasi masalah umum yang mungkin terjadi pada KoalaStore WhatsApp Bot.

## 🚨 Common Issues

### 🔌 Connection Issues

#### WhatsApp Won't Connect

**Symptoms:**
- QR Code tidak muncul
- Bot tidak respond setelah scan QR
- Connection timeout errors
- "Connection lost" messages

**Solutions:**

1. **Check Internet Connection**
   ```bash
   # Test connectivity
   ping google.com
   
   # Check if specific ports are blocked
   telnet web.whatsapp.com 443
   ```

2. **Clear Session Data**
   ```bash
   # Stop bot
   pm2 stop koalastore-bot
   
   # Remove session files
   rm -rf sessionn/*
   
   # Restart bot
   pm2 start koalastore-bot
   ```

3. **Update Baileys Library**
   ```bash
   npm update @whiskeysockets/baileys
   ```

4. **Check WhatsApp Web Limit**
   - Ensure WhatsApp Web not active on other devices
   - Only one Web session allowed per number
   - Logout from other Web sessions

5. **Firewall/Proxy Issues**
   ```bash
   # Check if corporate firewall blocks WhatsApp
   # Try different network (mobile hotspot)
   # Contact network administrator
   ```

#### Pairing Code Issues

**If using pairing code method:**

```bash
# Enable pairing code in .env
USE_PAIRING_CODE=true

# Or in code
const { usePairingCode } = config.bot;
```

**Common pairing code problems:**
- Code expires before entry → Generate new code
- Invalid number format → Use international format (62xxx)
- Already paired elsewhere → Logout from other sessions

### 🤖 Bot Not Responding

#### Commands Not Working

**Check these common causes:**

1. **Permission Issues**
   ```javascript
   // Verify user permissions
   console.log("User:", sender);
   console.log("Is Owner:", isOwner);
   console.log("Is Admin:", isAdmin);
   ```

2. **Command Registration**
   ```javascript
   // Check if command is registered
   const command = commandHandler.getCommand('commandname');
   console.log("Command found:", !!command);
   ```

3. **Error in Command Logic**
   ```bash
   # Check logs for errors
   tail -f logs/bot.log
   pm2 logs koalastore-bot
   ```

4. **Database File Permissions**
   ```bash
   # Check file permissions
   ls -la database/
   
   # Fix permissions if needed
   chmod 644 database/*.json
   ```

#### Slow Response Times

**Optimize performance:**

1. **Check System Resources**
   ```bash
   # Memory usage
   free -h
   
   # CPU usage
   top -p $(pgrep node)
   
   # Disk space
   df -h
   ```

2. **Database Optimization**
   ```javascript
   // Large database files can slow down responses
   // Consider pagination for large lists
   const products = getProducts().slice(0, 50); // Limit results
   ```

3. **Network Latency**
   ```bash
   # Test API response times
   curl -w "%{time_total}" https://web.whatsapp.com
   ```

### 📁 File & Database Issues

#### Database Corruption

**Symptoms:**
- JSON parse errors
- "Database not found" errors
- Commands that modify data fail

**Solutions:**

1. **Backup and Restore**
   ```bash
   # Create backup
   cp database/list.json database/list.json.backup
   
   # Check JSON validity
   cat database/list.json | jq .
   
   # If invalid, restore from backup
   cp database/list.json.backup database/list.json
   ```

2. **Reset Database**
   ```bash
   # Reset to empty state
   echo "[]" > database/list.json
   echo "[]" > database/list-produk.json
   echo "[]" > database/list-testi.json
   ```

3. **Fix JSON Syntax**
   ```javascript
   // Common JSON fixes
   // Remove trailing commas
   // Fix quotes (use double quotes)
   // Validate bracket matching
   ```

#### File Permission Errors

```bash
# Fix permissions
sudo chown -R $USER:$USER /path/to/KoalaStore
chmod -R 755 /path/to/KoalaStore
chmod -R 644 database/*.json
```

#### Media Upload Issues

**Problems with images/videos:**

1. **File Size Limits**
   ```javascript
   // Check file size in setting.js
   maxFileSize: 50 * 1024 * 1024, // 50MB
   ```

2. **Supported Formats**
   ```javascript
   allowedFileTypes: ['.jpg', '.jpeg', '.png', '.mp4', '.mp3']
   ```

3. **Storage Space**
   ```bash
   # Check available space
   df -h gambar/
   
   # Clean old files if needed
   find gambar/ -type f -mtime +30 -delete
   ```

### ⚙️ Configuration Issues

#### Environment Variables Not Loading

**Check .env file:**

```bash
# Verify .env exists and readable
ls -la .env
cat .env

# Check if variables are loaded
node -e "console.log(process.env.OWNER_NUMBER)"
```

**Common .env problems:**
- File not in root directory
- Incorrect variable names
- Missing quotes for values with spaces
- BOM characters in file

#### Settings Override Issues

**Check configuration precedence:**
1. Environment variables (highest priority)
2. `src/config/settings.js`
3. `setting.js` (root)
4. Default values (lowest priority)

```javascript
// Debug configuration loading
console.log("Final config:", config);
console.log("Owner number:", global.ownerNumber);
```

### 🔧 Installation Issues

#### Node.js Version Problems

**Check Node.js version:**
```bash
node --version
# Should be >= 20.0.0
```

**Install correct version:**
```bash
# Using nvm
nvm install 20
nvm use 20

# Or update system Node.js
# On Ubuntu:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### npm Installation Failures

**Common solutions:**

1. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules
   rm package-lock.json
   npm install
   ```

2. **Python/Build tools missing**
   ```bash
   # On Ubuntu/Debian
   sudo apt install build-essential python3
   
   # On Windows
   npm install --global windows-build-tools
   
   # On macOS
   xcode-select --install
   ```

3. **Permission issues**
   ```bash
   # Fix npm permissions
   sudo chown -R $USER /usr/local/lib/node_modules
   ```

#### Docker Issues

**Container won't start:**

1. **Check logs**
   ```bash
   docker logs koalastore-bot
   ```

2. **Volume mounting issues**
   ```bash
   # Ensure directories exist
   mkdir -p database logs sessionn gambar
   
   # Check permissions
   ls -la database/
   ```

3. **Port conflicts**
   ```bash
   # Check if port 3000 is available
   lsof -i :3000
   
   # Use different port
   docker run -p 3001:3000 koalastore-bot
   ```

## 🐛 Debugging Steps

### Enable Debug Logging

1. **Development mode**
   ```bash
   NODE_ENV=development npm run dev
   ```

2. **Increase log level**
   ```javascript
   // In logger configuration
   level: 'debug'  // or 'trace' for maximum detail
   ```

3. **Add debug statements**
   ```javascript
   console.log("Debug info:", { from, sender, body });
   logger.debug("Command executed", { command, args });
   ```

### Common Debug Commands

```bash
# Real-time log monitoring
tail -f logs/bot.log

# Search for specific errors
grep -i "error" logs/bot.log

# Check recent activity
tail -100 logs/bot.log

# Filter by command
grep "Command executed" logs/bot.log | tail -20
```

### Network Debugging

```bash
# Check if bot can reach WhatsApp servers
nslookup web.whatsapp.com
ping web.whatsapp.com

# Test HTTPS connectivity
curl -I https://web.whatsapp.com

# Check proxy settings
echo $HTTP_PROXY
echo $HTTPS_PROXY
```

## 🔍 Error Codes & Messages

### WhatsApp Connection Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `428` | Connection rate limited | Wait before reconnecting |
| `401` | Unauthorized | Clear session, re-authenticate |
| `403` | Forbidden | Check if number is banned |
| `500` | Server error | Retry after delay |

### Bot-specific Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| `Command not found` | Typo or unregistered command | Check command spelling |
| `Permission denied` | User lacks required permission | Verify admin/owner status |
| `Database error` | File corruption/permission | Check database files |
| `Media processing failed` | File format/size issue | Check media requirements |

## 🛠️ Recovery Procedures

### Complete Bot Reset

**When everything fails:**

```bash
# 1. Stop bot
pm2 stop koalastore-bot

# 2. Backup important data
cp -r database/ database_backup/

# 3. Clear session
rm -rf sessionn/*

# 4. Reset to fresh state
git checkout -- .
npm install

# 5. Restore data
cp -r database_backup/* database/

# 6. Start bot
pm2 start koalastore-bot
```

### Rollback to Previous Version

```bash
# Check git history
git log --oneline

# Rollback to previous commit
git reset --hard HEAD~1

# Or rollback to specific commit
git reset --hard <commit-hash>

# Reinstall dependencies
npm install
```

### Database Recovery

**If database is corrupted:**

```bash
# Try to fix JSON
cat database/list.json | jq . > database/list_fixed.json

# If unfixable, start fresh
echo "[]" > database/list.json

# Manually recreate critical data
# Or restore from backup if available
```

## 📞 Getting Help

### Self-Help Resources

1. **Check logs first** - Most issues show up in logs
2. **Search documentation** - Use Ctrl+F in docs
3. **Check GitHub issues** - Someone might have same problem
4. **Review recent changes** - What changed before issue started?

### Community Support

1. **GitHub Issues** - Report bugs with details
2. **Discussions** - Ask questions and share solutions
3. **Discord/Telegram** - Real-time community help

### When Reporting Issues

**Include this information:**

```markdown
**Environment:**
- OS: [Windows 10/Ubuntu 20.04/etc]
- Node.js version: [node --version]
- Bot version: [git describe --tags]

**Problem Description:**
[Clear description of what's wrong]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [Where it fails]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Logs:**
```
[Paste relevant log entries]
```

**Additional Context:**
[Any other relevant information]
```

## 🔧 Maintenance Tips

### Regular Maintenance

1. **Weekly:**
   - Check log files for errors
   - Verify bot response times
   - Monitor disk space usage

2. **Monthly:**
   - Update dependencies
   - Clean old log files
   - Backup database files
   - Review and clean media folder

3. **Quarterly:**
   - Update Node.js version
   - Review and update documentation
   - Performance optimization review

### Health Monitoring

```bash
# Create health check script
#!/bin/bash
# health_check.sh

# Check if bot process is running
if pgrep -f "koalastore-bot" > /dev/null; then
    echo "✅ Bot is running"
else
    echo "❌ Bot is not running"
    # Auto-restart
    pm2 restart koalastore-bot
fi

# Check response time
RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3000/health)
if [ "$RESPONSE" = "200" ]; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
fi
```

### Automated Monitoring

```bash
# Add to crontab for regular checks
crontab -e

# Check every 5 minutes
*/5 * * * * /path/to/health_check.sh >> /var/log/bot_health.log 2>&1
```

## 🚀 Next Steps

Jika masih mengalami masalah:

1. **[Installation Guide](.docs/02-installation.md)** - Reinstall dari awal
2. **[Configuration Guide](.docs/03-configuration.md)** - Review konfigurasi
3. **[GitHub Issues](https://github.com/yourusername/KoalaStore/issues)** - Report bug baru
4. **[Contributing Guide](.docs/10-contributing.md)** - Bantu perbaiki masalah

---

**Remember:** Kebanyakan masalah bisa diatasi dengan restart bot dan clear session data! 🔄 