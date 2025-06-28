# ⚙️ Configuration Guide

Panduan lengkap konfigurasi **KoalaStore Bot v2.0.0** untuk semua environment dari development hingga production. Bot mendukung konfigurasi berbasis file dan environment variables.

## 📋 Configuration Overview

Bot menggunakan multi-layer configuration system:

1. **`setting.js`** - Konfigurasi utama bot
2. **`.env`** - Environment variables (optional)
3. **`src/config/settings.js`** - Advanced configuration dengan fallbacks
4. **Runtime configuration** - Dynamic settings

## 🛠️ Basic Configuration

### Main Configuration File (`setting.js`)

File konfigurasi utama yang harus disesuaikan dengan toko Anda:

```javascript
const setting = {
  // Bot Identity
  ownerName: "Koala Store",                    // Nama pemilik toko
  ownerNumber: ["628123456789"],               // Nomor WhatsApp owner (array)
  botName: "KoalaStore Bot",                   // Nama bot
  
  // WhatsApp Settings
  sessionName: "koala-session",                // Nama session folder
  
  // Store Information
  storeName: "🐨 KOALA STORE",                // Nama toko untuk display
  storeDescription: "Digital Solutions & Services", // Deskripsi toko
  
  // Command Access Control
  adminCommands: [                             // Commands khusus admin
    "addlist", "dellist", "updatelist", 
    "setproses", "setdone"
  ],
  ownerCommands: [                             // Commands khusus owner
    "addproduk", "delproduk", "addsewa", 
    "delsewa", "broadcast"
  ],
  
  // Default Response Messages
  noCommand: "❌ Command tidak ditemukan!",
  onlyGroup: "❌ Command ini hanya bisa digunakan di grup!",
  onlyPrivate: "❌ Command ini hanya bisa digunakan di chat pribadi!",
  onlyAdmin: "❌ Command ini hanya untuk admin!",
  onlyOwner: "❌ Command ini hanya untuk owner!",
  
  // Bot Behavior
  public: true,                                // true = public, false = private
  
  // Media Settings
  maxFileSize: 50 * 1024 * 1024,              // 50MB max upload
  allowedFileTypes: [                         // Allowed file extensions
    '.jpg', '.jpeg', '.png', '.mp4', 
    '.mp3', '.pdf'
  ]
};

export default setting;
```

### Environment Variables (`.env`)

Create `.env` file untuk production configuration:

```env
# ================================================
# BOT CONFIGURATION
# ================================================
OWNER_NUMBER=628123456789
OWNER_NAME=Your Name
STORE_NAME=Your Store Name
BOT_NAME=Store Assistant Bot
USE_PAIRING_CODE=false
PORT=3000

# ================================================
# STORE INFORMATION
# ================================================
STORE_DESCRIPTION=Digital Solutions & Premium Services
BUSINESS_HOURS=09:00-21:00 WIB
LOCATION=Jakarta, Indonesia

# ================================================
# SOCIAL MEDIA LINKS
# ================================================
YOUTUBE_LINK=https://youtube.com/@yourchannel
INSTAGRAM_LINK=https://instagram.com/youraccount
FACEBOOK_LINK=https://facebook.com/yourpage
TWITTER_LINK=https://twitter.com/youraccount

# ================================================
# WHATSAPP GROUP LINKS
# ================================================
GROUP_LINK_1=https://chat.whatsapp.com/invite1
GROUP_LINK_2=https://chat.whatsapp.com/invite2
SUPPORT_GROUP=https://chat.whatsapp.com/support

# ================================================
# SOCIAL MEDIA LINKS
# ================================================
DANA_NUMBER=08123456789
DANA_NAME=Your Name
OVO_NUMBER=08123456789
OVO_NAME=Your Name
GOPAY_NUMBER=08123456789
GOPAY_NAME=Your Name
BANK_NAME=BCA
BANK_ACCOUNT=1234567890
BANK_HOLDER=Your Name
SAWER_LINK=https://saweria.co/youraccount

# ================================================
# ADVANCED SETTINGS
# ================================================
NODE_ENV=production
LOG_LEVEL=info
MAX_CONCURRENT_DOWNLOADS=3
RATE_LIMIT_PER_MINUTE=30
SESSION_TIMEOUT=86400000
AUTO_BACKUP_INTERVAL=3600000

# ================================================
# EXTERNAL API KEYS (Optional)
# ================================================
OPENAI_API_KEY=your_openai_key
GOOGLE_API_KEY=your_google_key
WEATHER_API_KEY=your_weather_key

# ================================================
# DATABASE SETTINGS
# ================================================
DB_TYPE=json
DB_BACKUP_INTERVAL=6
DB_MAX_BACKUPS=10
```

## 🔧 Advanced Configuration

### Runtime Configuration (`src/config/settings.js`)

Advanced configuration dengan automatic fallbacks:

```javascript
import chalk from "chalk";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
    bot: {
        ownerNumber: process.env.OWNER_NUMBER || "628123456789@s.whatsapp.net",
        kontakOwner: process.env.CONTACT_OWNER || "628123456789",
        namaStore: process.env.STORE_NAME || "KOALASTORE.DIGI",
        botName: process.env.BOT_NAME || "KOALA ASSISTANT",
        ownerName: process.env.OWNER_NAME || "Store Owner",
        usePairingCode: process.env.USE_PAIRING_CODE === 'true' || false,
        port: process.env.PORT || 3000,
        
        // Advanced Bot Settings
        maxRetries: 3,
        retryDelay: 5000,
        connectionTimeout: 30000,
        autoReconnect: true,
        qrTimeout: 60000
    },
    
    links: {
        youtube: process.env.YOUTUBE_LINK || "https://youtube.com/@defaultchannel",
        instagram: process.env.INSTAGRAM_LINK || "https://instagram.com/defaultaccount",
        facebook: process.env.FACEBOOK_LINK || "",
        twitter: process.env.TWITTER_LINK || "",
        groupLink1: process.env.GROUP_LINK_1 || "Link grup WhatsApp mu (1)",
        groupLink2: process.env.GROUP_LINK_2 || "Link grup WhatsApp mu (2)",
        supportGroup: process.env.SUPPORT_GROUP || ""
    },
    
    payment: {
        dana: {
            number: process.env.DANA_NUMBER || "08123456789",
            name: process.env.DANA_NAME || "Store Owner"
        },
        ovo: {
            number: process.env.OVO_NUMBER || "08123456789", 
            name: process.env.OVO_NAME || "Store Owner"
        },
        gopay: {
            number: process.env.GOPAY_NUMBER || "08123456789",
            name: process.env.GOPAY_NAME || "Store Owner"
        },
        bank: {
            name: process.env.BANK_NAME || "BCA",
            account: process.env.BANK_ACCOUNT || "1234567890",
            holder: process.env.BANK_HOLDER || "Store Owner"
        },
        sawer: process.env.SAWER_LINK || "https://saweria.co/defaultaccount"
    },
    
    paths: {
        database: "./database",
        media: "./gambar", 
        session: "./sessionn",
        logs: "./logs",
        temp: "./temp"
    },
    
    features: {
        autoBackup: true,
        welcomeMessage: true,
        antilinkProtection: true,
        afkDetection: true,
        messageQueue: true,
        rateLimiting: true,
        mediaProcessing: true,
        commandLogging: true
    },
    
    limits: {
        maxFileSize: 50 * 1024 * 1024,        // 50MB
        maxConcurrentDownloads: 3,
        rateLimit: 30,                         // per minute
        sessionTimeout: 24 * 60 * 60 * 1000,  // 24 hours
        commandCooldown: 2000                  // 2 seconds
    },
    
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        maxFiles: 5,
        maxSize: 10 * 1024 * 1024,            // 10MB per file
        enableConsole: true,
        enableFile: true,
        enableRotation: true
    }
};

export default config;
```

## 🗂️ Database Configuration

### JSON Database Settings

Bot menggunakan JSON files sebagai database default. Konfigurasi di `database/`:

```javascript
// Database structure dapat dikustomisasi
const databaseConfig = {
    autoBackup: true,
    backupInterval: 6 * 60 * 60 * 1000,  // 6 hours
    maxBackups: 10,
    compression: false,
    validation: true,
    
    files: {
        products: 'list-produk.json',
        testimonials: 'list-testi.json', 
        subscriptions: 'sewa.json',
        simple_list: 'list.json',
        templates_process: 'set_proses.json',
        templates_done: 'set_done.json',
        afk_status: 'afk.json',
        welcome_messages: 'welcome.json',
        antilink_settings: 'antilink.json',
        antilink2_settings: 'antilink2.json'
    }
};
```

### Migration to SQL (Optional)

Untuk high-volume stores, bot bisa di-migrate ke SQL database:

```javascript
// Future SQL configuration (dalam development)
const sqlConfig = {
    dialect: 'mysql', // atau 'postgresql', 'sqlite'
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'koalastore',
    
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    
    logging: process.env.NODE_ENV === 'development'
};
```

## 🔐 Security Configuration

### Authentication Settings

```javascript
const securityConfig = {
    // Rate Limiting
    rateLimit: {
        enabled: true,
        maxRequests: 30,        // per minute per user
        windowMs: 60 * 1000,    // 1 minute
        skipSuccessfulRequests: false
    },
    
    // Command Access
    permissions: {
        ownerOnly: ['broadcast', 'addproduk', 'mode', 'logout'],
        adminOnly: ['kick', 'tagall', 'addlist', 'setproses'],
        groupOnly: ['list', 'tagall', 'kick', 'open', 'close'],
        privateOnly: ['produk', 'testi']
    },
    
    // File Upload Security
    fileUpload: {
        maxSize: 50 * 1024 * 1024,  // 50MB
        allowedTypes: ['.jpg', '.jpeg', '.png', '.mp4', '.mp3', '.pdf'],
        scanForVirus: false,         // future feature
        quarantineLocation: './quarantine'
    },
    
    // Anti-spam
    antiSpam: {
        enabled: true,
        maxSameCommands: 5,      // dalam 1 menit
        cooldownDuration: 2000,   // 2 detik antar command
        blacklistDuration: 300000 // 5 menit blacklist
    }
};
```

## 🎨 UI/UX Configuration

### Message Templates

Customize response messages di `src/config/messages.js`:

```javascript
const messageConfig = {
    // Success Messages
    success: {
        productAdded: "✅ Produk berhasil ditambahkan ke catalog!",
        orderProcessed: "⏳ Pesanan Anda sedang diproses...",
        orderCompleted: "✅ Pesanan selesai! Terima kasih sudah berbelanja!",
        userKicked: "👮‍♂️ Member berhasil dikeluarkan dari grup",
        welcomeSet: "🎉 Welcome message berhasil diatur!"
    },
    
    // Error Messages  
    error: {
        noPermission: "❌ Anda tidak memiliki izin untuk command ini!",
        commandNotFound: "❓ Command tidak ditemukan. Ketik 'help' untuk bantuan",
        invalidFormat: "⚠️ Format command salah! Contoh: `addlist Produk|Harga`",
        mediaRequired: "📎 Silakan reply/upload media terlebih dahulu",
        groupOnly: "👥 Command ini hanya bisa digunakan di grup!",
        privateOnly: "💬 Command ini hanya bisa digunakan di chat pribadi!"
    },
    
    // Info Messages
    info: {
        botStarted: "🤖 Bot berhasil terhubung dan siap digunakan!",
        sessionConnected: "📱 Session WhatsApp berhasil terhubung",
        backupCreated: "💾 Backup database berhasil dibuat",
        rateLimitHit: "⏰ Silakan tunggu sebelum menggunakan command lagi"
    },
    
    // Menu Templates
    menus: {
        help: {
            header: "🐨 *KOALA STORE BOT*\n━━━━━━━━━━━━━━━",
            footer: "━━━━━━━━━━━━━━━\n💬 Ketik menu untuk melihat kategori",
            sections: {
                general: "🌟 *MENU UMUM*",
                admin: "👨‍💼 *MENU ADMIN*", 
                owner: "👑 *MENU OWNER*",
                store: "🛍️ *MENU TOKO*"
            }
        }
    }
};
```

## 🚀 Performance Configuration

### Optimization Settings

```javascript
const performanceConfig = {
    // Queue Management
    messageQueue: {
        enabled: true,
        concurrency: 3,
        timeout: 30000,
        retryAttempts: 2,
        retryDelay: 5000
    },
    
    // Caching
    cache: {
        enabled: true,
        ttl: 300000,           // 5 minutes
        maxSize: 100,          // 100 items
        checkPeriod: 60000     // cleanup every minute
    },
    
    // Memory Management
    memory: {
        maxHeapSize: '1024m',
        garbageCollection: true,
        heapSnapshot: false
    },
    
    // Network
    network: {
        timeout: 30000,
        retries: 3,
        keepAlive: true,
        maxSockets: 10
    }
};
```

## 🔄 Environment-Specific Configs

### Development Configuration

```javascript
// config/development.js
const developmentConfig = {
    logging: {
        level: 'debug',
        enableConsole: true,
        enableFile: false
    },
    
    features: {
        hotReload: true,
        debugMode: true,
        mockExternalAPIs: true
    },
    
    bot: {
        autoReconnect: false,  // Manual reconnect for debugging
        qrTimeout: 120000      // Longer QR timeout
    }
};
```

### Production Configuration

```javascript
// config/production.js
const productionConfig = {
    logging: {
        level: 'error',
        enableConsole: false,
        enableFile: true,
        enableRotation: true
    },
    
    features: {
        hotReload: false,
        debugMode: false,
        autoBackup: true,
        monitoring: true
    },
    
    bot: {
        autoReconnect: true,
        maxRetries: 5,
        healthCheck: true
    }
};
```

## 📊 Monitoring Configuration

### Health Check Settings

```javascript
const monitoringConfig = {
    healthCheck: {
        enabled: true,
        port: 3001,
        endpoint: '/health',
        interval: 30000,       // 30 seconds
        timeout: 5000
    },
    
    metrics: {
        enabled: true,
        collectInterval: 60000, // 1 minute
        retentionDays: 7,
        
        track: {
            commandUsage: true,
            responseTime: true,
            errorRate: true,
            memoryUsage: true,
            sessionHealth: true
        }
    },
    
    alerts: {
        enabled: false,        // future feature
        webhook: '',
        thresholds: {
            errorRate: 0.1,    // 10%
            responseTime: 5000, // 5 seconds
            memoryUsage: 0.8   // 80%
        }
    }
};
```

## 🎯 Configuration Best Practices

### ✅ **Recommended Setup**

1. **Development**:
   ```bash
   NODE_ENV=development
   LOG_LEVEL=debug
   USE_PAIRING_CODE=true
   ```

2. **Production**:
   ```bash
   NODE_ENV=production
   LOG_LEVEL=error
   USE_PAIRING_CODE=false
   ```

3. **Security**:
   - Never commit `.env` to version control
   - Use strong random passwords
   - Enable rate limiting
   - Regular security updates

### ⚠️ **Common Pitfalls**

1. **Wrong owner number format**:
   ```javascript
   // ❌ Wrong
   ownerNumber: "628123456789"
   
   // ✅ Correct
   ownerNumber: ["628123456789"]
   ```

2. **Environment variables not loading**:
   ```bash
   # Ensure .env is in project root
   # Check file permissions
   # Verify no syntax errors
   ```

3. **Path issues on Windows**:
   ```javascript
   // Use forward slashes or path.join()
   database: "./database",  // ✅ Works cross-platform
   ```

## 🔄 Dynamic Configuration

### Runtime Configuration Changes

Beberapa settings bisa diubah saat runtime:

```javascript
// Change bot mode
mode public    // Makes bot available to everyone
mode private   // Restricts bot to owner only

// Update social media info via configuration
# Update links di settings.js

// Toggle features
antilink on    // Enable anti-link protection
welcome off    // Disable welcome messages
```

## 📞 Configuration Help

### Validation

Bot akan validate configuration saat startup:

```javascript
// Configuration validation
function validateConfig(config) {
    const required = ['ownerNumber', 'botName', 'storeName'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required config: ${missing.join(', ')}`);
    }
}
```

### Debug Configuration

```bash
# Check current configuration
node -e "import('./src/config/settings.js').then(c => console.log(JSON.stringify(c.default, null, 2)))"

# Validate configuration
npm run config:validate

# Reset to defaults
npm run config:reset
```

---

**💡 Pro Tips:**
- Use environment-specific configs untuk different deployments
- Keep sensitive data di environment variables
- Test configuration changes di development first
- Backup configuration files before major changes
- Document custom configurations untuk team members

**Next: [Project Structure](./04-project-structure.md) →** 