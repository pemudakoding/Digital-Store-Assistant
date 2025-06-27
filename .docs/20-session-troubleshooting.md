# 🔧 Session Troubleshooting Guide

Panduan lengkap untuk mengatasi masalah session WhatsApp Bot, auto-cleaning yang tidak diinginkan, dan permintaan pairing code berulang.

## 🚨 Masalah Umum

### 1. Bot Selalu Minta Pairing Code
**Gejala:**
```
🧹 Auto-cleaning corrupted session...
📱 Pairing code: XXXXX
```

**Penyebab:**
- Session dianggap corrupt meskipun sebenarnya valid
- Logic validation session yang terlalu ketat
- File session tidak lengkap

**✅ Solusi:**
Masalah ini sudah diperbaiki dengan:
- Validation berbasis data user (`me.id`, `noiseKey`, dll)
- Tidak mengandalkan `registered: true` flag
- Check keberadaan file credentials sebelum request pairing

### 2. Auto-Cleaning Session Valid
**Gejala:**
```bash
[2025-06-27T06:37:04.543Z] 🧹 Auto-cleaning corrupted session...
```

**Root Cause:**
- Bot menggunakan `creds.registered` untuk validasi
- Baileys 6.7.18+ kadang set `registered: false` meski session valid
- Session folder terhapus padahal tidak corrupt

**✅ Solusi Terbaru:**
Session validation sekarang mengcheck:
```javascript
const hasValidData = creds.noiseKey && 
                    creds.signedIdentityKey && 
                    creds.me && 
                    creds.me.id &&
                    creds.signalIdentities &&
                    creds.signalIdentities.length > 0;
```

## 🔍 Diagnostic Tools

### Check Session Status
```bash
# Check session files
ls -la sessionn/

# Check credentials content
cat sessionn/creds.json | jq .registered
cat sessionn/creds.json | jq .me.id
```

### Manual Session Test
```javascript
// Run this in Node.js console
import fs from 'fs';
const creds = JSON.parse(fs.readFileSync('./sessionn/creds.json', 'utf8'));
console.log({
    registered: creds.registered,
    hasUser: !!creds.me,
    userId: creds.me?.id,
    userName: creds.me?.name,
    hasNoiseKey: !!creds.noiseKey,
    hasSignedIdentity: !!creds.signedIdentityKey
});
```

## 🛠️ Perbaikan yang Telah Dilakukan

### 1. Enhanced Session Validation (`app.js`)
**Before:**
```javascript
if (creds.registered) {
    log('✅ Session appears valid');
    return;
}
```

**After:**
```javascript
const hasValidData = creds.noiseKey && 
                    creds.signedIdentityKey && 
                    creds.me && 
                    creds.me.id &&
                    creds.signalIdentities &&
                    creds.signalIdentities.length > 0;

if (hasValidData) {
    log(`✅ Session is valid (User: ${creds.me.name})`);
    return;
}
```

### 2. Smart Pairing Code Request (`WhatsAppBot.js`)
**Before:**
```javascript
if (config.bot.usePairingCode && !this.client.authState.creds.registered) {
    const code = await this.client.requestPairingCode(phoneNumber);
}
```

**After:**
```javascript
const credsPath = `${config.paths.session}/creds.json`;
if (config.bot.usePairingCode && !fs.existsSync(credsPath)) {
    const code = await this.client.requestPairingCode(phoneNumber);
} else if (config.bot.usePairingCode && fs.existsSync(credsPath)) {
    logger.info('🔗 Using existing session - skipping pairing code');
}
```

### 3. Improved Connection Handling
**Fitur Baru:**
- QR code hanya tampil untuk session baru
- Exponential backoff dengan max delay 30s
- Graceful handling untuk status code 515 (session refresh)
- Proper session preservation pada shutdown

### 4. Better Shutdown Process
**Before:**
```javascript
this.client.end(undefined);
```

**After:**
```javascript
await this.client.ws.close(); // Graceful close
```

## 📋 Session File Structure

### Valid Session Contents
```
sessionn/
├── creds.json              # Main credentials
├── session-{number}.json   # Session data
├── app-state-sync-*.json   # App state sync
├── pre-key-*.json         # Pre-generated keys
└── app-state-sync-key-*.json # Sync keys
```

### Essential Fields in creds.json
```json
{
  "noiseKey": { "private": {...}, "public": {...} },
  "signedIdentityKey": { "private": {...}, "public": {...} },
  "me": {
    "id": "628xxx:xx@s.whatsapp.net",
    "name": "Bot Name"
  },
  "signalIdentities": [...],
  "registered": false  // ← Bisa false tapi session tetap valid!
}
```

## 🚀 Best Practices

### 1. Session Management
```bash
# ✅ BENAR - Graceful shutdown
npm stop
# atau
Ctrl + C  (di terminal)

# ❌ SALAH - Force kill
kill -9 <pid>
pkill -f node
```

### 2. Backup Session
```bash
# Backup sebelum update bot
cp -r sessionn sessionn.backup

# Restore jika diperlukan
rm -rf sessionn
mv sessionn.backup sessionn
```

### 3. Production Deployment
```bash
# ✅ Production mode
npm start           # PM2 dengan auto-restart

# ❌ Development mode di production
npm run dev         # Hot reload, tidak stabil untuk production
```

## 🔧 Troubleshooting Steps

### Step 1: Verify Session
```bash
# Check if session exists and valid
ls -la sessionn/
node -e "console.log(JSON.parse(require('fs').readFileSync('./sessionn/creds.json', 'utf8')).me?.id || 'No user ID')"
```

### Step 2: Test Connection
```bash
# Start bot dan check logs
npm start

# Monitor logs
pm2 logs KoalaStore-Bot --lines 50
```

### Step 3: Clean Start (Last Resort)
```bash
# Backup first
mv sessionn sessionn.backup.$(date +%s)

# Start fresh
npm start
# Scan QR code atau input pairing code
```

## 🐛 Common Error Codes

### Connection Errors
| Code | Meaning | Action |
|------|---------|--------|
| 401 | Session invalidated | Delete session, re-authenticate |
| 403 | Device not authorized | Delete session, re-authenticate |
| 428 | Connection replaced | Close other WhatsApp sessions |
| 515 | Session needs refresh | Auto-reconnect (handled automatically) |

### Log Messages
```bash
# ✅ Normal startup
✅ Session is valid (User: Bot Name)
🔗 Keeping existing session and connecting...
✅ Bot connected as 628xxx

# ⚠️ Session issues
⚠️ Session incomplete or corrupted
🧹 Auto-cleaning corrupted session...

# ❌ Connection problems
🚫 Session invalidated (logged out from another device)
❌ Device not authorized - please re-authenticate
```

## 📞 Support

Jika masalah berlanjut:

1. **Check logs lengkap:**
   ```bash
   pm2 logs --lines 100
   ```

2. **Restart dengan log:**
   ```bash
   DEBUG=* npm start
   ```

3. **Last resort - Fresh start:**
   ```bash
   rm -rf sessionn
   npm start
   ```

4. **Report issue:**
   - Copy logs error
   - Include session file structure
   - Mention bot version dan Node.js version

---

**💡 Pro Tips:**
- Session `registered: false` **NORMAL** di Baileys 6.7.18+
- Backup session sebelum update bot
- Gunakan `npm start` untuk production, bukan `npm run dev`
- Monitor PM2 logs untuk deteksi masalah early

**🎯 Expected Behavior After Fix:**
- ✅ No more false session cleaning
- ✅ No repetitive pairing code requests  
- ✅ Stable reconnection handling
- ✅ Session preservation on restart 