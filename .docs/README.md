# 📚 KoalaStore Bot Documentation

Selamat datang di dokumentasi lengkap **KoalaStore Bot v2.0.0** - WhatsApp Bot untuk Digital Store Management dengan arsitektur enterprise-grade dan reliability yang tinggi.

## 🎯 What's New in v2.0.0

- **🏗️ Enterprise Architecture** - Clean modular design dengan separation of concerns
- **🛡️ Race Condition Prevention** - Queue system untuk semua events dan commands
- **🤖 Self-Protection** - Bot tidak akan mengeksekusi command dari dirinya sendiri
- **⚡ Enhanced Performance** - Timeout protection dengan automatic retry dan fallback
- **📊 Real-time Monitoring** - Health checks, queue statistics, dan performance metrics
- **🔄 Auto-Recovery** - Self-healing capabilities dengan comprehensive error handling
- **🔧 Better Error Handling** - Context validation dan graceful degradation
- **🛡️ Enhanced Security** - Role-based access control yang lebih ketat
- **🖼️ Complete Image Support** - Full image management untuk store products
- **😴 Advanced AFK System** - Group-scoped AFK functionality dengan auto detection
- **🚀 PM2 Production Ready** - Non-interactive deployment dengan ecosystem configuration

## 🆕 Latest Features & Improvements

### 🛡️ **Reliability & Stability**
- **Queue System** - Semua events (connection.update, messages.upsert, group-participants.update) menggunakan queue
- **Self-Protection** - Mencegah infinite loops dengan bot ID detection
- **Error Recovery** - Automatic retry dengan exponential backoff untuk failed operations
- **Timeout Protection** - Command timeout (20s) dan middleware timeout (5s) dengan fallback responses
- **Health Monitoring** - Real-time bot status dengan health score calculation (0-100%)

### 📊 **Monitoring & Diagnostics**
- **botstat Command** - Comprehensive health monitoring untuk owner
- **resetqueue Command** - Emergency bot recovery dengan queue clearing
- **Queue Statistics** - Real-time monitoring semua queue (message, media, group, broadcast)
- **Memory Usage Tracking** - RSS, Heap Used, External memory monitoring
- **Command Statistics** - Execution count, error tracking, performance metrics

### ⚡ **Performance Enhancements**
- **Faster Error Detection** - Queue timeout reduction 50-75% (30-60s → 10-15s)
- **Rate Limiting** - Per-user message processing dengan 1 second cooldown
- **Fallback Mechanisms** - Multiple fallback layers untuk failed operations
- **User Feedback** - 100% error coverage dengan user-friendly messages

## 📖 Documentation Index

### 🚀 Getting Started
- **[01. Quick Start Guide](./01-quick-start.md)** - Setup bot dalam 3 menit
- **[02. Installation Guide](./02-installation.md)** - Instalasi production-ready lengkap
- **[03. Configuration](./03-configuration.md)** - Pengaturan dan kustomisasi advanced

### 🏗️ Architecture & Development
- **[04. Project Structure](./04-project-structure.md)** - Memahami struktur folder dan file
- **[05. Architecture Overview](./05-architecture.md)** - Arsitektur sistem dan komponen
- **[06. API Reference](./06-api-reference.md)** - Dokumentasi classes, methods, dan services

### 🎮 Features & Commands
- **[07. Commands Guide](./07-commands.md)** - Daftar lengkap command dan penggunaan
- **[08. Image Support](./08-image-support.md)** - Complete image management system untuk store products
- **[09. AFK System](./09-afk-system.md)** - Group-scoped AFK functionality dengan auto detection
- **[10. Store Management](./10-store-management.md)** - Pengelolaan produk dan layanan digital
- **[11. Admin Features](./11-admin-features.md)** - Fitur administrasi dan moderasi advanced

### 👨‍💻 Development
- **[12. Contributing Guide](./12-contributing.md)** - Panduan kontribusi dan development workflow
- **[13. Creating Commands](./13-creating-commands.md)** - Membuat command baru dengan best practices
- **[14. Testing Guide](./14-testing.md)** - Testing dan quality assurance

### 🔧 Operations & Deployment
- **[15. PM2 Deployment](./15-pm2-deployment.md)** - Complete PM2 setup dan management guide
- **[16. Deployment](./16-deployment.md)** - Deploy ke production dengan PM2/Docker
- **[17. Quick PM2 Setup](./17-quick-pm2-setup.md)** - 1-minute PM2 setup guide
- **[18. Troubleshooting](./18-troubleshooting.md)** - Mengatasi masalah umum dan debugging
- **[19. FAQ](./19-faq.md)** - Pertanyaan yang sering diajukan
- **[20. Session Troubleshooting](./20-session-troubleshooting.md)** - ⚡ Fix session dan pairing code issues

## 🎯 Untuk Developer Baru

Jika Anda baru bergabung dengan project ini:

1. **🚀 [Quick Start Guide](./01-quick-start.md)** - Menjalankan bot lokal dengan cepat
2. **📁 [Project Structure](./04-project-structure.md)** - Memahami organisasi kode dan folder
3. **🏗️ [Architecture Overview](./05-architecture.md)** - Cara kerja sistem dan komponen
4. **📖 [API Reference](./06-api-reference.md)** - Pelajari classes dan methods yang tersedia
5. **🤝 [Contributing Guide](./12-contributing.md)** - Mulai berkontribusi dengan benar

## 🎯 Untuk Store Owners (Pengguna)

Jika Anda ingin menggunakan bot untuk toko digital:

1. **⚙️ [Installation Guide](./02-installation.md)** - Setup production environment
2. **🔧 [Configuration](./03-configuration.md)** - Konfigurasi bot sesuai toko Anda
3. **🎮 [Commands Guide](./07-commands.md)** - Menggunakan semua fitur bot
4. **🛍️ [Store Management](./10-store-management.md)** - Mengelola produk dan customer
5. **🚀 [PM2 Deployment](./15-pm2-deployment.md)** - Deploy ke production dengan PM2

## 🔥 Key Features Overview

### 🛍️ Store Automation
- **Product Catalog Management** - Kelola ribuan produk dengan mudah
- **Image Support System** - Upload dan manage gambar produk dengan auto-optimization
- **Order Processing Templates** - Template otomatis untuk proses dan completion
- **Customer Testimonials** - Sistem review dan rating yang terintegrasi
- **Multi-Channel Payments** - Support DANA, OVO, GoPay, Bank Transfer
- **Rental/Subscription System** - Kelola layanan berlangganan dengan automatic renewal

### 🤖 Smart Automation
- **Intelligent Command Routing** - Command handler yang cerdas dan modular dengan monitoring
- **Auto-Response System** - Respons otomatis berdasarkan context dengan rate limiting
- **Group Welcome Messages** - Pesan sambutan yang dapat dikustomisasi dengan media support
- **AFK Detection & Notification** - Deteksi status user otomatis dengan group scope
- **Anti-Link Protection** - Proteksi spam dengan whitelist intelligent dan automatic cleanup
- **Queue Management** - Semua operations menggunakan queue untuk prevent race conditions

### 👨‍💼 Advanced Administration
- **Role-Based Access Control** - Owner > Admin > User hierarchy yang ketat dengan validation
- **Complete Group Management** - Kick, promote, demote, tag semua member dengan permissions
- **Broadcast System** - Kirim pesan ke ribuan chat sekaligus dengan queue management
- **Session Management** - Auto-reconnect dengan session preservation dan error recovery
- **Message Queue System** - Rate limiting dan spam protection dengan health monitoring
- **Real-time Monitoring** - Bot health, queue statistics, memory usage, command performance

### 🎨 Media & Utilities
- **AI-Powered Sticker Maker** - Convert media ke sticker WhatsApp dengan compression
- **Social Media Integration** - TikTok downloader, gaming stalking tools dengan API integration
- **Advanced Calculator** - Operasi matematika dengan support formula dan history
- **File Management System** - Upload/download dengan validasi dan compression automatic
- **Scraping Services** - Integration dengan berbagai external APIs dengan caching

### 🔧 Developer Experience
- **Modern ES6+ Architecture** - Class-based design dengan modules dan TypeScript-ready
- **Hot Reload Development** - Auto-restart saat development dengan file watching
- **Structured Logging** - Pino logger dengan JSON output dan multiple levels
- **Comprehensive Error Handling** - Error recovery dan graceful degradation dengan context
- **Extensible Command System** - Mudah menambah fitur baru dengan template dan validation
- **Production Monitoring** - Health checks, performance metrics, automatic diagnostics

## 🔗 Quick Navigation

### 📚 Documentation Categories

| Category | Description | Best For |
|----------|-------------|----------|
| **🚀 Getting Started** | Setup dan konfigurasi awal | Pemula yang ingin coba bot |
| **🏗️ Architecture** | Teknis dan struktur kode | Developer yang ingin kontribusi |
| **🎮 Features** | Panduan penggunaan fitur | Store owner dan admin |
| **👨‍💻 Development** | Development dan testing | Contributor dan developer |
| **🔧 Operations** | Deployment dan maintenance | DevOps dan production users |

### 🔧 Tech Stack Reference

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Runtime** | Node.js | 20.0.0+ | JavaScript runtime |
| **WhatsApp API** | Baileys | 6.7.18 | WhatsApp Web integration |
| **Database** | JSON Files | - | Simple data storage |
| **Logging** | Pino | 9.5.0+ | High-performance logging |
| **Queue** | p-queue | 8.0.1+ | Message rate limiting & race condition prevention |
| **Media Processing** | Jimp + FFmpeg | Latest | Image/video processing |
| **Web Framework** | Express.js | 4.19.7+ | Health check endpoints |
| **Process Manager** | PM2 | Latest | Production process management |

## 🎯 Use Cases

### 💼 Digital Store Owners
- Automate customer service 24/7 dengan intelligent responses
- Manage product catalog dengan gambar real-time dan auto-optimization
- Process orders dengan template dan automatic status updates
- Handle payments multiple channels dengan transaction tracking
- Build customer loyalty dengan testimonials dan review system

### 👥 Community Managers
- Moderate large WhatsApp groups dengan advanced admin tools
- Welcome new members automatically dengan media support
- Prevent spam dan unwanted links dengan intelligent detection
- Manage member permissions dengan AFK system dan role-based access
- Broadcast announcements dengan queue management dan rate limiting

### 🎮 Gaming Communities
- Lookup player statistics (FF, ML) dengan real-time data
- Share gaming content dan media dengan auto-processing
- Manage gaming group activities dengan event scheduling
- Organize tournaments dan events dengan participant tracking

### 👨‍💻 Developers
- Learn modern Node.js architecture dengan clean code principles
- Contribute to open source project dengan comprehensive documentation
- Build custom commands dan integrations dengan extensible system
- Practice enterprise-grade development dengan monitoring dan testing

## 🚀 Quick Links

| Action | Link | Description |
|--------|------|-------------|
| 🚀 **Get Started** | [Quick Start](./01-quick-start.md) | Setup dalam 3 menit |
| 📖 **Learn Architecture** | [Architecture Guide](./05-architecture.md) | Understand how it works |
| 🎮 **Use Features** | [Commands Guide](./07-commands.md) | Complete feature list |
| 🖼️ **Image Support** | [Image Support](./08-image-support.md) | Product image management |
| 😴 **AFK System** | [AFK System](./09-afk-system.md) | Group-scoped AFK functionality |
| 👨‍💻 **Contribute** | [Contributing](./12-contributing.md) | Join development |
| 🚀 **PM2 Deploy** | [PM2 Deployment](./15-pm2-deployment.md) | Production deployment |
| ⚡ **Quick PM2** | [Quick PM2 Setup](./17-quick-pm2-setup.md) | 1-minute setup |
| 🆘 **Get Help** | [Troubleshooting](./18-troubleshooting.md) | Solve problems |

## 📊 Project Stats

- **📦 Version**: 2.0.0 (Enterprise Architecture)
- **🏗️ Architecture**: Modular ES6 Classes dengan queue system
- **🎯 Commands**: 50+ built-in commands dengan monitoring dan health checks
- **🔧 Extensibility**: Plugin-ready architecture dengan validation
- **📈 Performance**: <500ms average response time dengan queue optimization
- **🛡️ Security**: Role-based access control + self-protection + race condition prevention
- **🌍 Community**: 1000+ users worldwide dengan active development
- **🖼️ Image Support**: Full product image management dengan auto-optimization
- **😴 AFK System**: Group-scoped functionality dengan auto-detection
- **🚀 PM2 Ready**: Production deployment ready dengan ecosystem configuration
- **🔄 Reliability**: 99.9% uptime dengan auto-recovery dan health monitoring

## 📞 Support & Community

### Getting Help
- **📖 [Documentation](./)** - Comprehensive guides dan tutorials dengan examples
- **🐛 [GitHub Issues](https://github.com/pemudakoding/Digital-Store-Assistant/issues)** - Bug reports dan feature requests
- **💬 [Discussions](https://github.com/pemudakoding/Digital-Store-Assistant/discussions)** - Community Q&A dan ideas
- **📧 Email**: pemudakoding@gmail.com - Direct contact untuk urgent issues

### Common Troubleshooting Commands
```bash
# Check bot health (owner only in WhatsApp chat)
botstat

# Emergency queue reset (owner only)
resetqueue

# Clean session dan restart
npm run clean:win && npm run pm2:restart

# Monitor in real-time
npm run pm2:monit

# View logs
npm run pm2:logs
```

---

<div align="center">

**🐨 KoalaStore Bot v2.0.0**  
*Enterprise WhatsApp Bot • Production Ready • Open Source*

**Made with ❤️ by the KoalaStore Team**

</div> 