# 🐨 KoalaStore Bot v2.0.0

> **WhatsApp Bot untuk Digital Store Management dengan arsitektur modern dan fitur enterprise-grade**

[![Node.js](https://img.shields.io/badge/Node.js-20.0.0+-green.svg)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.18-blue.svg)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PM2](https://img.shields.io/badge/PM2-Ready-brightgreen.svg)](https://pm2.keymetrics.io/)

## 🚀 Quick Start

Jalankan KoalaStore Bot hanya dalam 3 menit:

```bash
# 1. Clone repository
git clone https://github.com/pemudakoding/Digital-Store-Assistant.git
cd KoalaStore

# 2. Install dependencies
npm install

# 3. Configure environment (optional)
# Edit src/config/settings.js untuk kustomisasi

# 4. Start bot (Development)
npm run dev

# 5. Start bot (Production dengan PM2)
npm run pm2:start
```

**📖 [Dokumentasi Lengkap →](.docs/README.md)**

## ✨ Fitur Terbaru v2.0.0

### 🛡️ **Enterprise-Grade Reliability**
- **Queue System** - Semua events di-queue untuk mencegah race conditions
- **Self-Protection** - Bot tidak akan mengeksekusi command dari dirinya sendiri
- **Error Recovery** - Automatic retry dengan exponential backoff
- **Health Monitoring** - Real-time bot status dan performance metrics
- **Timeout Protection** - Command timeout dengan fallback responses

### 🛍️ **Advanced Store Management**
- **🖼️ Image Support** - Upload dan manage gambar produk otomatis
- **Order Processing** - Template otomatis untuk proses dan completion
- **Payment Integration** - Support DANA, OVO, GoPay, Bank Transfer
- **Customer Testimonials** - Sistem review dan rating terintegrasi
- **Product Catalog** - Kelola ribuan produk dengan search dan categories

### 🤖 **Smart Automation**
- **😴 AFK System** - Group-scoped AFK dengan auto detection
- **Enhanced Commands** - 50+ commands dengan role-based access
- **Message Queue System** - Queue management untuk performance optimization
- **Anti-Link Protection** - Proteksi spam dengan whitelist intelligent
- **Group Management** - Welcome, kick, promote, broadcast otomatis

### 🎨 **Media & Utilities**
- **Sticker Maker** - Convert media ke sticker WhatsApp
- **TikTok Downloader** - Download video/audio TikTok tanpa watermark
- **Gaming Tools** - FF/ML stalking, advanced calculator
- **Social Media** - Integration dengan berbagai platform

### 🔧 **Developer Experience**
- **Clean Architecture** - ES6 modules dengan separation of concerns
- **Hot Reload** - Auto-restart untuk development yang cepat
- **Structured Logging** - Pino logger dengan JSON output
- **PM2 Ready** - Production deployment non-interactive
- **Monitoring Commands** - `botstat`, `resetqueue` untuk owner

## 📦 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 20+ | JavaScript runtime |
| **WhatsApp** | Baileys 6.7.18 | WhatsApp Web API |
| **Database** | JSON Files | Simple data storage |
| **Process Manager** | PM2 | Production deployment |
| **Logging** | Pino | High-performance logging |
| **Queue** | p-queue | Race condition prevention & performance optimization |

## 🎯 Use Cases

- **💼 Digital Store Owners** - Automate customer service dan catalog management
- **👥 Community Managers** - Moderate groups dengan AFK system dan admin tools
- **🎮 Gaming Communities** - Player lookup dan community management
- **👨‍💻 Developers** - Learn modern Node.js architecture dan contribute

## 📚 Dokumentasi

### Quick Navigation
- **🚀 [Quick Start](.docs/01-quick-start.md)** - Setup dalam 5 menit
- **📖 [Commands Guide](.docs/07-commands.md)** - 50+ commands lengkap
- **🖼️ [Image Support](.docs/08-image-support.md)** - Product image management
- **😴 [AFK System](.docs/09-afk-system.md)** - Group-scoped AFK functionality
- **🚀 [PM2 Deployment](.docs/15-pm2-deployment.md)** - Production setup
- **⚡ [Quick PM2 Setup](.docs/17-quick-pm2-setup.md)** - 1-minute setup

### Complete Documentation
**📖 [Buka Dokumentasi Lengkap →](.docs/README.md)**

Dokumentasi lengkap mencakup:
- ✅ Installation & Configuration guides
- ✅ Architecture & development guides  
- ✅ Complete feature documentation
- ✅ API reference & examples
- ✅ Deployment & operations guides
- ✅ Troubleshooting & FAQ

## 🔧 Production Deployment

### Menggunakan PM2 (Recommended)
```bash
# Install PM2 globally
npm install pm2 -g

# Start dengan PM2
npm run pm2:start

# Monitor
pm2 monit

# Logs
pm2 logs koalastore-bot

# Restart
npm run pm2:restart
```

### Development Mode
```bash
# Development dengan hot reload
npm run dev

# Development dengan custom environment
NODE_ENV=development npm start

# Clean session (jika ada masalah login)
npm run clean:win  # Windows
npm run clean      # Linux/Mac
```

**📖 [Complete Deployment Guide →](.docs/15-pm2-deployment.md)**

## 🆕 Latest Updates

### v2.0.0 Recent Improvements
- **✅ Queue System** - Semua events menggunakan queue untuk prevent race conditions
- **✅ Self-Protection** - Bot tidak lagi merespon command dari dirinya sendiri
- **✅ Enhanced Error Handling** - Better context validation dan graceful degradation
- **✅ Monitoring Commands** - `botstat` dan `resetqueue` untuk owner monitoring
- **✅ Improved Hidetag** - Forward message tanpa command prefix
- **✅ Timeout Protection** - Commands dengan automatic timeout dan retry

### Performance Improvements
- **⚡ Faster Response** - Average <500ms response time
- **🛡️ Better Stability** - Race condition prevention
- **📊 Real-time Monitoring** - Health checks dan queue statistics
- **🔄 Auto-Recovery** - Self-healing capabilities

## 🤝 Contributing

Kami welcome kontribusi! Bacalah panduan berikut:

1. **📖 [Contributing Guide](.docs/12-contributing.md)** - Development workflow
2. **🏗️ [Architecture Guide](.docs/05-architecture.md)** - Understand codebase
3. **⚡ [Creating Commands](.docs/13-creating-commands.md)** - Add new features

### Development Setup
```bash
# Fork dan clone repository
git clone https://github.com/YOUR_USERNAME/Digital-Store-Assistant.git
cd KoalaStore

# Install dependencies
npm install

# Start development mode (hot reload)
npm run dev

# Available scripts
npm run start          # Production start
npm run dev            # Development mode
npm run pm2:start      # Start with PM2
npm run clean:win      # Clean session (Windows)
npm run clean          # Clean session (Linux/Mac)
```

## 📊 Project Stats

- **📦 Version**: 2.0.0 (Enterprise Architecture)
- **🎯 Commands**: 50+ built-in commands dengan monitoring
- **🖼️ Image Support**: Full product management dengan auto-upload
- **😴 AFK System**: Group-scoped functionality dengan auto-detection
- **🚀 PM2 Ready**: Non-interactive production deployment
- **📈 Performance**: <500ms response time dengan queue system
- **🛡️ Security**: Role-based access + self-protection + race condition prevention
- **🔄 Reliability**: Auto-retry, timeout protection, health monitoring

## 🆘 Support

### Getting Help
- **📖 [Documentation](.docs/README.md)** - Comprehensive guides
- **🐛 [Issues](https://github.com/pemudakoding/Digital-Store-Assistant/issues)** - Bug reports
- **💬 [Discussions](https://github.com/pemudakoding/Digital-Store-Assistant/discussions)** - Community Q&A
- **📧 Email**: pemudakoding@gmail.com

### Common Commands untuk Troubleshooting
```bash
# Check bot status (owner only in chat)
botstat

# Reset queue jika ada masalah (owner only)
resetqueue

# Clean session dan restart
npm run clean:win && npm run pm2:restart

# View logs
npm run pm2:logs
```

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">

**🐨 KoalaStore Bot v2.0.0**  
*Enterprise WhatsApp Bot • Production Ready • Open Source*

[📖 Documentation](.docs/README.md) • [🚀 Quick Start](.docs/01-quick-start.md) • [🤝 Contributing](.docs/12-contributing.md) • [🆘 Support](#-support)

**Made with ❤️ by the KoalaStore Team**

</div> 