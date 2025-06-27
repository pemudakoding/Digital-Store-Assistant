# 🐨 KoalaStore Bot v2.0.0

> **WhatsApp Bot untuk Digital Store Management dengan arsitektur modern dan fitur lengkap**

[![Node.js](https://img.shields.io/badge/Node.js-20.0.0+-green.svg)](https://nodejs.org/)
[![Baileys](https://img.shields.io/badge/Baileys-6.7.18-blue.svg)](https://github.com/WhiskeySockets/Baileys)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PM2](https://img.shields.io/badge/PM2-Ready-brightgreen.svg)](https://pm2.keymetrics.io/)

## 🚀 Quick Start

Jalankan KoalaStore Bot hanya dalam 5 menit:

```bash
# 1. Clone repository
git clone https://github.com/pemudakoding/Digital-Store-Assistant.git
cd KoalaStore

# 2. Install dependencies
npm install

# 3. Setup configuration
cp setting.js.example setting.js
# Edit setting.js dengan konfigurasi Anda

# 4. Start bot (Development)
npm run dev

# 5. Start bot (Production dengan PM2)
npm start
```

**📖 [Dokumentasi Lengkap →](.docs/README.md)**

## ✨ Fitur Utama

### 🛍️ **Store Management**
- **Catalog Management** - Kelola ribuan produk dengan mudah
- **🖼️ Image Support** - Upload dan manage gambar produk otomatis
- **Order Processing** - Template otomatis untuk proses dan completion
- **Payment Integration** - Support DANA, OVO, GoPay, Bank Transfer
- **Customer Testimonials** - Sistem review dan rating terintegrasi

### 🤖 **Smart Automation**
- **😴 AFK System** - Group-scoped AFK dengan auto detection
- **Command Router** - 50+ commands dengan role-based access
- **Auto-Response** - Respons otomatis berdasarkan context
- **Anti-Link Protection** - Proteksi spam dengan whitelist
- **Group Management** - Welcome, kick, promote, broadcast

### 🎨 **Media & Utilities**
- **Sticker Maker** - Convert media ke sticker WhatsApp
- **TikTok Downloader** - Download video/audio TikTok
- **Gaming Tools** - FF/ML stalking, calculator
- **Social Media** - Integration dengan berbagai platform

### 🔧 **Developer Experience**
- **Clean Architecture** - ES6 modules dengan separation of concerns
- **Hot Reload** - Auto-restart untuk development
- **Queue System** - Rate limiting dan spam protection
- **Structured Logging** - Pino logger dengan JSON output
- **PM2 Ready** - Production deployment non-interactive

## 📦 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 20+ | JavaScript runtime |
| **WhatsApp** | Baileys 6.7.18 | WhatsApp Web API |
| **Database** | JSON Files | Simple data storage |
| **Process Manager** | PM2 | Production deployment |
| **Logging** | Pino | High-performance logging |
| **Queue** | p-queue | Rate limiting |

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
npm start

# Atau manual
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs KoalaStore-Bot
```

### Menggunakan Docker
```bash
# Build image
docker build -t koalastore-bot .

# Run container
docker run -d --name koalastore \
  -v $(pwd)/database:/app/database \
  -v $(pwd)/sessionn:/app/sessionn \
  koalastore-bot
```

**📖 [Complete Deployment Guide →](.docs/15-pm2-deployment.md)**

## 🤝 Contributing

Kami welcome kontribusi! Bacalah panduan berikut:

1. **📖 [Contributing Guide](.docs/12-contributing.md)** - Development workflow
2. **🏗️ [Architecture Guide](.docs/05-architecture.md)** - Understand codebase
3. **⚡ [Creating Commands](.docs/13-creating-commands.md)** - Add new features

### Development Setup
```bash
# Fork dan clone repository
git clone https://github.com/pemudakoding/Digital-Store-Assistant.git

# Install dependencies
npm install

# Start development mode (hot reload)
npm run dev

# Run tests
npm test
```

## 📊 Project Stats

- **📦 Version**: 2.0.0 (Clean Architecture)
- **🎯 Commands**: 50+ built-in commands
- **🖼️ Image Support**: Full product management
- **😴 AFK System**: Group-scoped functionality  
- **🚀 PM2 Ready**: Non-interactive production setup
- **📈 Performance**: <500ms response time
- **🛡️ Security**: Role-based access control

## 🆘 Support

### Getting Help
- **📖 [Documentation](.docs/README.md)** - Comprehensive guides
- **🐛 [Issues](https://github.com/pemudakoding/Digital-Store-Assistant/issues)** - Bug reports
- **💬 [Discussions](https://github.com/pemudakoding/Digital-Store-Assistant/discussions)** - Community Q&A
- **📧 Email**: pemudakoding@gmail.com

## 📄 License

Released under the [MIT License](LICENSE).

---

<div align="center">

**🐨 Koalastore.digi Bot v2.0.0**  
*Modern WhatsApp Bot • Production Ready • Open Source*

[📖 Documentation](.docs/README.md) • [🚀 Quick Start](.docs/01-quick-start.md) • [🤝 Contributing](.docs/12-contributing.md) • [🆘 Support](#-support)

**Made with ❤️ by the KoalaStore.digi Team**

</div> 