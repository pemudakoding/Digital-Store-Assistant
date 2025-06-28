# 🚀 Quick Start Guide

Dapatkan **KoalaStore Bot v2.0.0** berjalan dalam 3 menit dengan enterprise-grade features!

## ⚡ Super Fast Setup

### 1. **Clone Repository**
```bash
git clone https://github.com/pemudakoding/Digital-Store-Assistant.git
cd KoalaStore
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Start Bot**
```bash
# Development mode (dengan hot reload)
npm run dev

# Production mode
npm start

# Production dengan PM2
npm run pm2:start
```

**🎉 Selesai!** Bot siap digunakan dalam hitungan menit!

## 🎯 Verifikasi Setup

### Check Bot Status
Setelah bot running, test di WhatsApp:

```
# Command untuk owner (pastikan edit config dulu)
botstat

# Response yang diharapkan:
🤖 BOT STATUS REPORT
🟢 Overall Health: Excellent (100%)
⏰ Uptime: 1 minutes
...
```

### Test Basic Commands
```
# Test commands dasar
ping
help
allmenu
```

## 🔧 Konfigurasi (Opsional)

Bot dapat berjalan dengan default settings, tetapi untuk production sebaiknya customize:

### Edit Configuration
```bash
# Edit file konfigurasi
nano src/config/settings.js
```

### Key Settings
```javascript
const config = {
    bot: {
        ownerNumber: "628xxxxxxxxxxxx@s.whatsapp.net", // Nomor owner
        botName: "KoalaStore Assistant",                 // Nama bot
        usePairingCode: true                            // false untuk QR code
    },
    payment: {
        dana: "08xxxxxxxxxxxx",                         // Nomor DANA
        ovo: "08xxxxxxxxxxxx",                          // Nomor OVO
        gopay: "08xxxxxxxxxxxx"                         // Nomor GoPay
    }
};
```

## 📱 Pairing dengan WhatsApp

Bot mendukung 2 metode koneksi:

### Method 1: Pairing Code (Recommended)
```bash
# Set usePairingCode: true di config
npm start

# Masukkan nomor WhatsApp (awali dengan 62)
# Contoh: 6285xxxxxxxxx
```

### Method 2: QR Code
```bash
# Set usePairingCode: false di config
npm start

# Scan QR code yang muncul di terminal
```

## 🚀 Production Deployment

### Menggunakan PM2
```bash
# Install PM2 globally
npm install pm2 -g

# Start dengan PM2
npm run pm2:start

# Monitor
pm2 monit

# Logs
npm run pm2:logs
```

**📖 [Complete Deployment Guide →](./15-pm2-deployment.md)**

## ✨ Fitur Terbaru v2.0.0

### 🛡️ **Enterprise Reliability**
- **Queue System** - Semua events menggunakan queue untuk prevent race conditions
- **Self-Protection** - Bot tidak merespon command dari dirinya sendiri
- **Error Recovery** - Automatic retry dengan exponential backoff
- **Health Monitoring** - Real-time bot health dengan `botstat` command

### 📊 **Monitoring Commands**
```bash
# Check bot health (owner only)
botstat

# Emergency queue reset (owner only)  
resetqueue

# View performance stats
npm run pm2:monit
```

### 🎮 **Enhanced Commands**
- **50+ Commands** dengan role-based access
- **Improved Hidetag** - Forward message tanpa command prefix
- **Advanced Calculator** - Operasi matematika lengkap
- **Media Processing** - Sticker maker, TikTok downloader

### 🛍️ **Store Features**
- **Product Management** - Kelola catalog dengan images
- **Order Processing** - Template untuk proses dan completion
- **Social Integration** - YouTube, Instagram, Group Links
- **Customer Reviews** - Testimonial system

## 🎯 First Steps After Setup

### 1. **Configure as Owner**
```bash
# Edit owner number di src/config/settings.js
ownerNumber: "628xxxxxxxxxxxx@s.whatsapp.net"
```

### 2. **Test Basic Functions**
```
# Di WhatsApp, test commands:
help           # Lihat semua commands
allmenu        # Menu lengkap
botstat        # Health check (owner only)
ping           # Test response time
```

### 3. **Setup Store (Optional)**
```
# Add products
addproduk nama|harga|deskripsi

# Add testimonials  
addtesti nama|rating|review

# Set payment methods
payment         # Lihat info pembayaran
```

### 4. **Group Management**
```
# Add bot ke group
# Set as admin
# Test group commands:
welcome on      # Enable welcome messages
antilink on     # Enable anti-link protection
hidetag test    # Test broadcast to all members
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Session Issues**
```bash
# Clean session dan restart
npm run clean:win    # Windows
npm run clean        # Linux/Mac
npm start
```

#### 2. **Permission Issues (Linux/Mac)**
```bash
# Fix permissions
chmod +x start.js
sudo npm install -g pm2
```

#### 3. **Bot Not Responding**
```bash
# Check if running
npm run pm2:status

# Restart if needed
npm run pm2:restart

# View logs for errors
npm run pm2:logs
```

#### 4. **High Memory Usage**
```bash
# Check bot health
botstat

# Reset queues if needed
resetqueue

# Restart if critical
npm run pm2:restart
```

## 📚 Next Steps

### For Store Owners
1. **[Store Management Guide](./10-store-management.md)** - Kelola products dan orders
2. **[Payment Integration](./03-configuration.md#payment)** - Setup payment methods
3. **[Admin Features](./11-admin-features.md)** - Group management tools

### For Developers  
1. **[Architecture Overview](./05-architecture.md)** - Understand the codebase
2. **[Creating Commands](./13-creating-commands.md)** - Add new features
3. **[Contributing Guide](./12-contributing.md)** - Join development

### For Community Managers
1. **[Commands Guide](./07-commands.md)** - Complete command reference
2. **[AFK System](./09-afk-system.md)** - Group-scoped AFK management
3. **[Group Features](./11-admin-features.md)** - Advanced group tools

## 🆘 Need Help?

### Documentation
- **[Complete Documentation](./README.md)** - Full feature guide
- **[FAQ](./19-faq.md)** - Common questions
- **[Troubleshooting](./18-troubleshooting.md)** - Problem solving

### Support Channels
- **[GitHub Issues](https://github.com/pemudakoding/Digital-Store-Assistant/issues)** - Bug reports
- **[Discussions](https://github.com/pemudakoding/Digital-Store-Assistant/discussions)** - Q&A
- **Email**: pemudakoding@gmail.com

### Quick Commands untuk Help
```bash
# Bot health check
botstat

# View all available commands  
help

# Emergency recovery
resetqueue

# View logs
npm run pm2:logs
```

---

**🎉 Congratulations!** KoalaStore Bot sekarang ready untuk handle your digital store operations with enterprise-grade reliability!

**Next**: [Complete Configuration Guide →](./03-configuration.md) 