# 📦 Installation Guide

Panduan instalasi lengkap KoalaStore WhatsApp Bot untuk berbagai environment.

## 📋 System Requirements

### Minimum Requirements
- **OS:** Windows 10/11, macOS 10.15+, Linux (Ubuntu 18.04+)
- **Node.js:** >= 20.0.0
- **RAM:** 512MB minimum (1GB recommended)
- **Storage:** 1GB free space
- **Network:** Stable internet connection

### Recommended
- **Node.js:** Latest LTS version
- **RAM:** 2GB or more
- **Storage:** 5GB for logs and media
- **CPU:** 2 cores or more

## 🛠️ Local Development Setup

### 1. Install Node.js

#### Windows:
```bash
# Download dan install dari https://nodejs.org/
# Atau gunakan chocolatey:
choco install nodejs

# Verify installation
node --version
npm --version
```

#### macOS:
```bash
# Install dengan Homebrew:
brew install node

# Atau download dari https://nodejs.org/
```

#### Linux (Ubuntu/Debian):
```bash
# Install Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### 2. Clone Repository

```bash
# Clone project
git clone https://github.com/yourusername/KoalaStore.git
cd KoalaStore

# Atau fork dulu jika ingin contribute
```

### 3. Install Dependencies

```bash
# Install semua dependencies
npm install

# Atau jika menggunakan yarn
yarn install
```

### 4. Environment Setup

#### Development Environment

1. **Copy environment template:**
```bash
cp .env.example .env
```

2. **Edit `.env` file:**
```env
# Bot Configuration
OWNER_NUMBER=62812345xxxxx
CONTACT_OWNER=62812345xxxxx
STORE_NAME=KOALASTORE.DIGI
BOT_NAME=KOALA ASSISTANT
OWNER_NAME=Your Name

# External Links
YOUTUBE_LINK=https://youtube.com/@yourchanel
INSTAGRAM_LINK=https://instagram.com/youraccount
GROUP_LINK_1=https://chat.whatsapp.com/yourgroup1
GROUP_LINK_2=https://chat.whatsapp.com/yourgroup2

# Payment Info
DANA_NUMBER=08123456789
OVO_NUMBER=08123456789
GOPAY_NUMBER=08123456789
SAWER_LINK=https://saweria.co/youraccount

# Development
NODE_ENV=development
USE_PAIRING_CODE=false
PORT=3000
```

### 5. Database Setup

Bot menggunakan JSON file sebagai database. Buat struktur folder:

```bash
# Database akan dibuat otomatis, tapi pastikan folder ada
mkdir -p database
mkdir -p logs
mkdir -p sessionn
mkdir -p gambar
```

#### Database Files:
- `database/list-produk.json` - Daftar produk store
- `database/list-testi.json` - Testimoni customer  
- `database/sewa.json` - Data subscription/rental
- `database/afk.json` - Status AFK users
- `database/welcome.json` - Pesan welcome grup
- `database/antilink.json` - Anti-link settings

### 6. Media Setup

Upload file media yang diperlukan ke folder `gambar/`:

```bash
# File yang perlu disiapkan:
gambar/
├── qris.jpg          # QR Code pembayaran
├── thumbnail.jpg     # Thumbnail bot
└── suara.mp3        # Audio file (optional)
```

## 🚀 Production Setup

### 1. Server Preparation

#### VPS/Cloud Server (Ubuntu):
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2
```

### 2. Application Deployment

```bash
# Clone ke server
git clone https://github.com/yourusername/KoalaStore.git
cd KoalaStore

# Install dependencies
npm install --production

# Copy dan setup environment
cp .env.example .env.production
nano .env.production
```

### 3. Production Environment

```env
# Production Environment
NODE_ENV=production
USE_PAIRING_CODE=true
PORT=3000

# Database paths (optional, default sudah benar)
DATABASE_PATH=./database
MEDIA_PATH=./gambar
SESSION_PATH=./sessionn

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/bot.log
```

### 4. PM2 Configuration

Buat file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'koalastore-bot',
    script: 'src/app.js',
    cwd: '/path/to/KoalaStore',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true
  }]
};
```

### 5. Start Production

```bash
# Start dengan PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
# Ikuti instruksi yang muncul

# Monitor
pm2 status
pm2 logs koalastore-bot
```

## 🐳 Docker Setup

### 1. Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p database logs sessionn gambar

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
version: '3.8'

services:
  koalastore-bot:
    build: .
    container_name: koalastore-bot
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - ./database:/app/database
      - ./logs:/app/logs
      - ./sessionn:/app/sessionn
      - ./gambar:/app/gambar
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - koalastore-network

networks:
  koalastore-network:
    driver: bridge
```

### 3. Run dengan Docker

```bash
# Build dan run
docker-compose up -d

# Monitor logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔧 Verification

### 1. Health Check

```bash
# Check jika bot berjalan
curl http://localhost:3000/health

# Response yang diharapkan:
# {"status": "ok", "uptime": "00:05:30"}
```

### 2. WhatsApp Connection

1. **QR Code Method:** Bot akan display QR di console
2. **Pairing Code Method:** Set `USE_PAIRING_CODE=true` dan gunakan nomor

### 3. Test Commands

Kirim pesan test ke bot:
```
ping
help
list
```

## 🔄 Updates & Maintenance

### 1. Update Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Restart application
pm2 restart koalastore-bot
```

### 2. Database Backup

```bash
# Backup database
tar -czf backup-$(date +%Y%m%d).tar.gz database/

# Restore
tar -xzf backup-20240101.tar.gz
```

### 3. Log Rotation

Setup logrotate untuk production:

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/koalastore-bot
```

```
/path/to/KoalaStore/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    postrotate
        pm2 reloadLogs
    endscript
}
```

## ❗ Troubleshooting

### Common Issues

**Permission denied errors:**
```bash
sudo chown -R $USER:$USER /path/to/KoalaStore
chmod +x src/app.js
```

**Port already in use:**
```bash
# Find process using port
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>
```

**Node.js version issues:**
```bash
# Install nvm untuk manage Node.js versions
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install dan use specific version
nvm install 20
nvm use 20
```

**WhatsApp connection issues:**
- Clear `sessionn` folder
- Check internet connection
- Verify phone number format
- Ensure WhatsApp Web tidak active di device lain

## 📞 Support

Jika mengalami issues:
1. Check [Troubleshooting Guide](./14-troubleshooting.md)
2. Search di [GitHub Issues](https://github.com/yourusername/KoalaStore/issues)
3. Buat issue baru dengan detail lengkap
4. Join grup developer untuk bantuan real-time

---

**Next Steps:** [Configuration Guide](./03-configuration.md) 