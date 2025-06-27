# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan **KoalaStore Bot v2.0.0** dalam 5 menit! Guide ini akan membantu Anda setup dan menjalankan bot dengan konfigurasi dasar.

## 📋 Prerequisites

Pastikan Anda sudah memiliki:

```bash
✅ Node.js 20.0.0 atau lebih baru
✅ npm atau yarn package manager
✅ Git untuk cloning repository
✅ WhatsApp account untuk bot
✅ Koneksi internet yang stabil
✅ Text editor (VS Code, Sublime, dll)
```

### Cek Requirements
```bash
# Cek versi Node.js
node --version  # harus >= 20.0.0

# Cek npm
npm --version

# Cek git
git --version
```

## ⚡ 5-Minute Setup

### Step 1: Clone Repository
```bash
# Clone project
git clone https://github.com/pemudakoding/Digital-Store-Assistant.git
cd KoalaStore

# Atau download ZIP dan extract
```

### Step 2: Install Dependencies
```bash
# Install semua dependencies
npm install

# Tunggu hingga selesai (biasanya 2-3 menit)
```

### Step 3: Basic Configuration
```bash
# Copy dan edit file konfigurasi
cp setting.js setting.js.backup  # backup original
nano setting.js  # atau gunakan editor favorit Anda
```

Edit `setting.js` dengan informasi Anda:
```javascript
const setting = {
  ownerName: "Nama Toko Anda",
  ownerNumber: ["628123456789"], // GANTI dengan nomor WhatsApp Anda
  botName: "Bot Toko Anda",
  storeName: "🏪 NAMA TOKO ANDA",
  storeDescription: "Digital Solutions & Services",
  public: true, // true = semua bisa pakai, false = hanya owner
};
```

### Step 4: Run Bot
```bash
# Jalankan bot
npm start

# Atau untuk development dengan hot reload
npm run dev
```

### Step 5: Connect WhatsApp
1. **QR Code akan muncul** di terminal
2. **Buka WhatsApp** di phone Anda
3. **Pergi ke** Menu (⋮) → **Linked Devices**
4. **Tap "Link a Device"**
5. **Scan QR Code** yang muncul di terminal
6. **Bot Connected!** ✅

## 🎮 Test Bot

Setelah terhubung, test bot dengan mengirim pesan:

```bash
# Kirim ke bot (private chat atau grup):
help           # Menu bantuan
ping           # Test response time
owner          # Info kontak owner
```

**Jika bot merespons, selamat! Setup berhasil! 🎉**

## 🛠️ Configuration Options

### Environment Variables (.env)
Buat file `.env` untuk konfigurasi advanced:
```env
# Bot Configuration
OWNER_NUMBER=628123456789
STORE_NAME=Your Store Name
BOT_NAME=Store Bot
PORT=3000

# Payment Info
DANA_NUMBER=08123456789
OVO_NUMBER=08123456789
GOPAY_NUMBER=08123456789

# Social Links
YOUTUBE_LINK=https://youtube.com/@yourchannel
INSTAGRAM_LINK=https://instagram.com/youraccount
```

### Database Setup
Bot menggunakan JSON files sebagai database (sudah auto-generated):
```
database/
├── list-produk.json    # Product catalog
├── list-testi.json     # Customer testimonials  
├── sewa.json          # Rental/subscription data
├── set_done.json      # Order completion templates
└── set_proses.json    # Order processing templates
```

## 🔧 Development Mode

Untuk development dengan hot reload:

```bash
# Start development mode
npm run dev

# Bot akan auto-restart saat ada perubahan file
```

## 📱 Adding to Groups

1. **Add bot ke grup** WhatsApp
2. **Jadikan admin** (untuk fitur moderasi)
3. **Test commands**:
   ```bash
   list          # Lihat daftar produk
   help          # Menu bantuan grup
   ```

## 🎯 Next Steps

Setelah setup dasar berhasil:

1. **📖 [Configuration Guide](./03-configuration.md)** - Kustomisasi advanced
2. **🎮 [Commands Guide](./07-commands.md)** - Pelajari semua fitur
3. **🛍️ [Store Management](./10-store-management.md)** - Kelola produk dan customer
4. **🔧 [Deployment Guide](./16-deployment.md)** - Deploy ke production

## ⚠️ Common Issues

### Bot tidak connect?
```bash
# Clean session dan coba lagi
npm run clean       # Linux/Mac
npm run clean:win   # Windows

# Restart bot
npm start
```

### Permission errors?
```bash
# Fix file permissions
sudo chmod -R 755 .
npm install
```

### Port already in use?
```bash
# Kill existing Node processes
npm run kill        # Windows
pkill node          # Linux/Mac
```

### Dependencies error?
```bash
# Clear cache dan reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🆘 Getting Help

Jika mengalami masalah:

1. **📞 [Troubleshooting Guide](./18-troubleshooting.md)** - Common solutions
2. **❓ [FAQ](./19-faq.md)** - Frequently asked questions
3. **🐛 [GitHub Issues](https://github.com/yourusername/KoalaStore/issues)** - Report bugs
4. **💬 [Community Chat](https://chat.whatsapp.com/invite)** - Get help from users

## 🎉 Success!

Jika semua berjalan lancar, Anda sekarang memiliki:

- ✅ **Bot WhatsApp** yang berjalan dan terhubung
- ✅ **Basic store management** untuk produk digital
- ✅ **Command system** yang siap digunakan
- ✅ **Development environment** yang ready

**Selamat! Bot Anda sudah siap untuk mengelola toko digital! 🎊**

---

**💡 Pro Tips:**
- Simpan QR code screenshot untuk backup
- Backup file `sessionn/` untuk preserve connection
- Join komunitas untuk tips dan update
- Baca full documentation untuk advanced features

**Next: [Installation Guide](./02-installation.md) →** 