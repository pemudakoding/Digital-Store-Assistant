# 📁 Project Structure

Dokumentasi lengkap struktur project **KoalaStore Bot v2.0.0** dengan arsitektur modular dan clean code principles. Project ini dibangun dengan ES6 modules dan mengikuti separation of concerns pattern.

## 🏗️ High-Level Architecture

```
KoalaStore/
├── 📁 src/                    # Source code utama (ES6 modules)
├── 📁 database/               # JSON-based data storage
├── 📁 .docs/                  # Documentation lengkap
├── 📁 gambar/                 # Media assets (images, audio)
├── 📁 sessionn/               # WhatsApp session data
├── 📁 logs/                   # Application logs
├── 📄 start.js                # Startup script dengan health checks
├── 📄 setting.js              # Bot configuration
└── 📄 package.json            # Dependencies dan scripts
```

## 📦 Core Source Code (`src/`)

### 🎯 Command System (`src/commands/`)

Commands diorganisir berdasarkan kategori untuk kemudahan maintenance:

```
src/commands/
├── 📁 general/                # Commands umum untuk semua user
│   ├── help.js               # Menu bantuan dinamis
│   ├── allmenu.js            # Tampilan semua menu kategori
│   ├── ping.js               # Health check dan latency test
│   ├── sticker.js            # AI-powered sticker maker
│   ├── owner.js              # Info kontak owner
│   ├── donasi.js             # Info donasi dan support
│   ├── script.js             # Info script bot
│   ├── tiktok.js             # TikTok video downloader
│   ├── tiktokaudio.js        # TikTok audio extractor
│   ├── ffstalk.js            # Free Fire player lookup
│   ├── mlstalk.js            # Mobile Legends stalking
│   ├── afk.js                # AFK status management
│   └── ceksewa.js            # Subscription status checker
├── 📁 admin/                  # Commands untuk group admin
│   ├── addlist.js            # Tambah item ke product list
│   ├── dellist.js            # Hapus item dari list
│   ├── updatelist.js         # Update item list existing
│   ├── changelist.js         # Edit item list interaktif
│   ├── hapuslist.js          # Hapus multiple items
│   ├── setproses.js          # Set template order processing
│   ├── setdone.js            # Set template order completion
│   ├── delsetproses.js       # Hapus template proses
│   ├── delsetdone.js         # Hapus template done
│   ├── proses.js             # Mark order sebagai processing
│   ├── done.js               # Mark order sebagai complete
│   ├── tagall.js             # Tag semua member grup
│   ├── hidetag.js            # Tag tersembunyi untuk semua
│   ├── kick.js               # Kick member dari grup
│   ├── group.js              # Group info dan management
│   ├── open.js               # Buka grup untuk semua
│   ├── close.js              # Tutup grup untuk member
│   ├── welcome.js            # Set welcome message
│   ├── antilink.js           # Anti-link protection toggle
│   ├── antilink2.js          # Advanced anti-link dengan whitelist
│   ├── linkgrup.js           # Generate group invite link
│   ├── revoke.js             # Revoke group invite link
│   ├── delete.js             # Delete bot message
│   └── fitnah.js             # Quote message faker
├── 📁 owner/                  # Commands khusus owner
│   ├── addproduk.js          # Tambah produk ke catalog
│   ├── delproduk.js          # Hapus produk dari catalog
│   ├── addtesti.js           # Tambah customer testimonial
│   ├── deltesti.js           # Hapus testimonial
│   ├── addsewa.js            # Tambah subscription service
│   ├── delsewa.js            # Hapus subscription service
│   ├── listsewa.js           # List semua subscription aktif
│   ├── broadcast.js          # Broadcast message ke all chats
│   ├── mode.js               # Toggle public/private mode
│   ├── join.js               # Join grup via invite link
│   ├── block.js              # Block user from bot
│   ├── unblock.js            # Unblock user
│   ├── logout.js             # Logout dan clear session
│   ├── gantiqris.js          # Update payment QR code
│   └── queuestats.js         # Message queue statistics
├── 📁 store/                  # Commands untuk store management
│   ├── list.js               # Display product list (group only)
│   ├── produk.js             # Display products (private only)
│   ├── testi.js              # Display testimonials (private only)
│   └── payment.js            # Payment information multi-channel
├── 📁 calculator/             # Mathematical operations
│   ├── tambah.js             # Addition operation
│   ├── kurang.js             # Subtraction operation
│   ├── kali.js               # Multiplication operation
│   └── bagi.js               # Division operation
└── 📄 legacy                  # Legacy command placeholder
```

### 🎛️ Core Handlers (`src/handlers/`)

```
src/handlers/
├── CommandHandler.js          # Command routing dan middleware system
└── MessageHandler.js          # Message processing dan filtering
```

**CommandHandler.js Features:**
- Dynamic command registration
- Middleware support (auth, validation, rate limiting)
- Permission-based access control
- Error handling dan logging
- Command aliases support
- Category-based organization

**MessageHandler.js Features:**
- Message type detection (text, media, document)
- Auto-response untuk keywords
- AFK detection dan notification
- Anti-link protection
- Message queue management

### 🗃️ Data Models (`src/models/`)

Semua model menggunakan JSON files sebagai database dengan proper abstraction:

```
src/models/
├── DatabaseManager.js         # Base database operations
├── ListManager.js             # Product list management
├── TestiManager.js            # Customer testimonials
├── SewaManager.js             # Rental/subscription services
├── ProdukManager.js           # Product catalog management
├── AfkManager.js              # AFK status tracking
├── WelcomeManager.js          # Group welcome messages
├── AntilinkManager.js         # Anti-link configuration
└── TemplateManager.js         # Message templates (proses/done)
```

**Model Features:**
- Async/await untuk all operations
- Data validation dan sanitization
- Error handling dan recovery
- Automatic backup creation
- Memory caching untuk performance
- Thread-safe file operations

### 🔧 Business Services (`src/services/`)

```
src/services/
├── MessageService.js          # WhatsApp messaging abstraction
├── MediaService.js            # Media processing (images, videos, audio)
├── GroupService.js            # Group management operations
└── ScraperService.js          # External API integrations
```

**MessageService.js:**
- Send text, media, dan document messages
- Reply, react, dan forward functionality
- Message formatting dan templating
- Typing indicator management
- Message scheduling

**MediaService.js:**
- Image processing dengan Jimp
- Video/audio conversion dengan FFmpeg
- Sticker creation dan optimization
- File validation dan compression
- Format conversion

**GroupService.js:**
- Member management (kick, promote, demote)
- Group settings (open/close, description)
- Invite link generation
- Welcome message automation
- Permission checking

**ScraperService.js:**
- TikTok video/audio downloader
- Free Fire player statistics
- Mobile Legends data lookup
- External API rate limiting
- Cache management

### 🛠️ Utilities (`src/utils/`)

```
src/utils/
├── logger.js                  # Structured logging dengan Pino
├── queue.js                   # Message queue dan rate limiting
├── helpers.js                 # Common helper functions
├── common.js                  # Shared utilities
├── console.js                 # Console output formatting
├── baileys.js                 # WhatsApp client utilities
├── hotReload.js               # Development hot reload
└── messageSerializer.js       # Message serialization
```

**Key Utilities:**

- **logger.js**: JSON structured logging, multiple levels, file rotation
- **queue.js**: Rate limiting, spam protection, message ordering
- **helpers.js**: Text formatting, validation, parsing functions
- **baileys.js**: WhatsApp client extensions dan helpers

### ⚙️ Configuration (`src/config/`)

```
src/config/
├── settings.js                # Environment-based configuration
└── messages.js                # Response message templates
```

**settings.js Features:**
- Environment variable support
- Default value fallbacks
- Hot reload capability
- Global variable compatibility
- Path management

### 🔐 Middleware (`src/middleware/`)

```
src/middleware/
└── authMiddleware.js          # Authentication dan authorization
```

**authMiddleware.js:**
- Role-based access control (Owner > Admin > User)
- Permission checking per command
- Group vs private chat validation
- Rate limiting per user
- Security logging

### 🎯 Main Bot Class (`src/WhatsAppBot.js`)

Main orchestrator class yang menggabungkan semua komponen:

```javascript
// Key responsibilities:
class WhatsAppBot {
  // Session management
  // Service initialization  
  // Event handling
  // Command registration
  // Error recovery
  // Graceful shutdown
}
```

## 📊 Database Structure (`database/`)

JSON-based database untuk simplicity dan easy backup:

```
database/
├── list-produk.json           # Product catalog
│   └── [{ id, nama, harga, deskripsi, kategori, timestamp }]
├── list-testi.json            # Customer testimonials  
│   └── [{ id, customer, rating, komentar, timestamp }]
├── sewa.json                  # Rental/subscription services
│   └── [{ id, service, durasi, harga, timestamp }]
├── list.json                  # Simple product list (legacy)
│   └── [{ id, nama, harga }]
├── set_proses.json            # Order processing templates
│   └── [{ id, template, timestamp }]
├── set_done.json              # Order completion templates
│   └── [{ id, template, timestamp }]
├── afk.json                   # AFK status tracking
│   └── [{ userId, reason, timestamp }]
├── welcome.json               # Group welcome messages
│   └── [{ groupId, message, enabled, timestamp }]
├── antilink.json              # Anti-link group settings
│   └── [{ groupId, enabled, whitelist, action }]
└── antilink2.json             # Advanced anti-link settings
    └── [{ groupId, strictMode, allowOwner, customMessage }]
```

## 🎨 Media Assets (`gambar/`)

```
gambar/
├── qris.jpg                   # Payment QR code
├── thumbnail.jpg              # Bot profile picture
├── suara.mp3                  # Audio assets
├── *.jpg                      # Dynamic images (user uploads)
└── Saran Ukuran gambar jangan lebih dari 50kb
```

## 📝 Documentation (`.docs/`)

Complete documentation structure:

```
.docs/
├── README.md                  # Documentation overview
├── 01-quick-start.md          # 5-minute setup guide
├── 02-installation.md         # Production installation
├── 03-configuration.md        # Advanced configuration
├── 04-project-structure.md    # This file
├── 05-architecture.md         # System architecture
├── 06-api-reference.md        # API documentation
├── 07-commands.md             # Complete command reference
├── 08-store-management.md     # Store management guide
├── 09-admin-features.md       # Admin functionality
├── 10-contributing.md         # Development guide
├── 11-creating-commands.md    # Command development
├── 12-testing.md              # Testing guide
├── 13-deployment.md           # Production deployment
├── 14-troubleshooting.md      # Common issues
└── 15-faq.md                  # Frequently asked questions
```

## 🔄 Session Management (`sessionn/`)

WhatsApp session data (auto-generated):

```
sessionn/
├── creds.json                 # Authentication credentials
├── keys/                      # Encryption keys
└── ...                        # Other Baileys session files
```

## 📊 Logging (`logs/`)

Structured application logs:

```
logs/
├── combined.log               # All log levels
├── error.log                  # Error level only
├── info.log                   # Info level dan above
└── debug.log                  # Debug level (development)
```

## 📄 Root Files

### Configuration Files

```
├── setting.js                 # Main bot configuration
├── package.json               # Dependencies dan scripts
├── .env                       # Environment variables (optional)
├── .gitignore                 # Git ignore patterns
└── README.md                  # Project overview
```

### Startup Scripts

```
├── start.js                   # Clean startup dengan health checks
└── src/app.js                 # Direct app entry point
```

**start.js Features:**
- Session validation
- Process cleanup
- Error handling
- Graceful shutdown
- Windows/Linux compatibility

## 🔧 Key Design Patterns

### 1. **Modular Architecture**
- Each component has single responsibility
- Loose coupling between modules
- Easy to test dan maintain

### 2. **Manager Pattern**
```javascript
// Each data type has dedicated manager
const listManager = new ListManager();
const testiManager = new TestiManager();
const sewaManager = new SewaManager();
```

### 3. **Service Layer**
```javascript
// Business logic separated from handlers
const messageService = new MessageService(client);
const mediaService = new MediaService();
const groupService = new GroupService(client);
```

### 4. **Command Pattern**
```javascript
// Commands are pluggable dan extensible
commandHandler.register('command', metadata, handler);
```

### 5. **Middleware Pattern**
```javascript
// Authentication dan validation as middleware
commandHandler.use(authMiddleware);
```

## 📊 File Size Guidelines

- **Commands**: 1-3KB each (focused functionality)
- **Models**: 3-5KB each (CRUD operations)
- **Services**: 5-10KB each (business logic)
- **Utils**: 1-2KB each (helper functions)
- **Main files**: 10-20KB (orchestration)

## 🎯 Benefits of This Structure

### ✅ **Maintainability**
- Clear separation of concerns
- Easy to locate dan modify code
- Consistent patterns throughout

### ✅ **Scalability**
- Easy to add new commands
- Modular services can be extracted
- Database can be migrated to SQL

### ✅ **Testability**
- Each component can be unit tested
- Mock dependencies easily
- Integration tests possible

### ✅ **Developer Experience**
- Hot reload support
- Clear file organization
- Comprehensive documentation

### ✅ **Production Ready**
- Error handling everywhere
- Logging dan monitoring
- Graceful shutdown
- Session persistence

---

**💡 Pro Tips:**
- Use VS Code dengan file icons extension untuk better navigation
- Install ES6 snippets untuk faster development
- Use search/find functionality untuk locate specific functionality
- Follow the established patterns ketika adding new features

**Next: [Architecture Overview](./05-architecture.md) →** 