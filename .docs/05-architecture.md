# 🏗️ Architecture Overview

Dokumentasi ini menjelaskan arsitektur dan cara kerja sistem KoalaStore WhatsApp Bot.

## 🎯 System Overview

KoalaStore Bot dibangun dengan arsitektur modular yang memisahkan concerns dan memudahkan maintenance serta pengembangan.

```
┌─────────────────────────────────────────────────────────────┐
│                    WhatsApp Client                          │
│                  (User Interface)                           │
└─────────────────────┬───────────────────────────────────────┘
                      │ Messages/Commands
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 WhatsAppBot.js                              │
│               (Main Bot Class)                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
   ┌─────────┐ ┌─────────────┐ ┌────────────┐
   │ Message │ │  Command    │ │ Middleware │
   │ Handler │ │  Handler    │ │  System    │
   └─────────┘ └─────────────┘ └────────────┘
          │           │              │
          └───────────┼──────────────┘
                      ▼
    ┌─────────────────────────────────────────┐
    │              Services Layer             │
    │  ┌─────────────┐ ┌──────────────────────┐│
    │  │ Message     │ │ Group Service       ││
    │  │ Service     │ │ Media Service       ││
    │  │             │ │ Scraper Service     ││
    │  └─────────────┘ └──────────────────────┘│
    └─────────────────────────────────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────────┐
    │              Models Layer               │
    │  ┌─────────────┐ ┌──────────────────────┐│
    │  │ List        │ │ Database Managers    ││
    │  │ Manager     │ │ (Produk, Testi,     ││
    │  │             │ │  Sewa, AFK, etc.)    ││
    │  └─────────────┘ └──────────────────────┘│
    └─────────────────────────────────────────┘
                      │
                      ▼
    ┌─────────────────────────────────────────┐
    │              Data Layer                 │
    │         JSON Database Files             │
    │  ┌─────────────┐ ┌──────────────────────┐│
    │  │ list.json   │ │ testimonials.json    ││
    │  │ produk.json │ │ users.json          ││
    │  │ sewa.json   │ │ settings.json       ││
    │  └─────────────┘ └──────────────────────┘│
    └─────────────────────────────────────────┘
```

## 🧩 Core Components

### 1. WhatsAppBot (Main Class)

**Location:** `src/WhatsAppBot.js`

**Responsibilities:**
- Initialize WhatsApp connection
- Manage bot lifecycle
- Coordinate all components
- Handle connection events

**Key Methods:**
```javascript
class WhatsAppBot {
    constructor()           // Initialize all managers and services
    async start()          // Start bot and connect to WhatsApp
    async stop()           // Graceful shutdown
    setupEventHandlers()   // Setup message/connection listeners
    loadCommands()         // Load and register all commands
}
```

### 2. Handler Layer

#### MessageHandler
**Location:** `src/handlers/MessageHandler.js`

**Responsibilities:**
- Process incoming WhatsApp messages
- Route messages to appropriate handlers
- Handle special message types (media, group events)

#### CommandHandler
**Location:** `src/handlers/CommandHandler.js`

**Responsibilities:**
- Parse and execute commands
- Apply middleware (auth, rate limiting)
- Command registration and management

**Usage Pattern:**
```javascript
// Register command
commandHandler.register('help', {
    description: 'Show help menu',
    category: 'general',
    aliases: ['menu']
}, commandFunction);

// Execute command
await commandHandler.execute(context, command, args);
```

### 3. Services Layer

#### MessageService
**Location:** `src/services/MessageService.js`

**Purpose:** Handle all WhatsApp message operations
```javascript
class MessageService {
    async reply(jid, text, quoted)          // Reply to message
    async sendText(jid, text)               // Send text message
    async sendMedia(jid, media, caption)    // Send media with caption
    async sendLocation(jid, lat, lon)       // Send location
}
```

#### GroupService
**Location:** `src/services/GroupService.js`

**Purpose:** Group management operations
```javascript
class GroupService {
    async kickMember(groupId, userId)       // Remove member
    async promoteAdmin(groupId, userId)     // Promote to admin
    async getGroupInfo(groupId)             // Get group metadata
    async updateGroupSettings(groupId, settings) // Update group
}
```

#### MediaService
**Location:** `src/services/MediaService.js`

**Purpose:** Media processing and manipulation
```javascript
class MediaService {
    async downloadMedia(message)            // Download media from message
    async createSticker(buffer)             // Convert to sticker
    async processImage(buffer, options)     // Image processing
}
```

### 4. Models Layer (Data Managers)

#### ListManager
**Location:** `src/models/ListManager.js`

**Purpose:** Manage product lists
```javascript
class ListManager {
    async addList(name, description)        // Add product to list
    async getList()                         // Get all products
    async updateList(name, newData)         // Update product
    async deleteList(name)                  // Remove product
}
```

#### ProdukManager
**Location:** `src/models/ProdukManager.js`

**Purpose:** Manage full product catalog
```javascript
class ProdukManager {
    async addProduk(data)                   // Add product to catalog
    async getProduk(name)                   // Get specific product
    async getAllProduk()                    // Get all products
    async deleteProduk(name)                // Remove product
}
```

#### TestiManager
**Location:** `src/models/TestiManager.js`

**Purpose:** Manage customer testimonials
```javascript
class TestiManager {
    async addTesti(customerData)            // Add new testimonial
    async getTesti()                        // Get all testimonials
    async deleteTesti(id)                   // Remove testimonial
}
```

## 🔄 Message Flow

### 1. Incoming Message Processing

```
1. WhatsApp Message Received
   ↓
2. MessageHandler.process()
   ↓
3. Check if message is command
   ↓
4. Apply Middleware (auth, rate limiting)
   ↓
5. CommandHandler.execute()
   ↓
6. Execute Command Function
   ↓
7. Use Services for operations
   ↓
8. Update Data via Managers
   ↓
9. Send Response via MessageService
```

### 2. Command Execution Flow

```javascript
// Example: `addproduk Netflix|25000|Premium account`

1. CommandHandler receives: "addproduk"
2. Middleware checks: isOwner(user) ✓
3. Parse args: ["Netflix", "25000", "Premium account"]
4. Execute: commands/owner/addproduk.js
5. Validate input data
6. Call: ProdukManager.addProduk(data)
7. Update: database/produk.json
8. Send confirmation via MessageService
```

### 3. Group Event Processing

```javascript
// Example: User joins group

1. GroupService detects: participants.add
2. Check: WelcomeManager.isEnabled(groupId)
3. Get: WelcomeManager.getMessage(groupId)
4. Send: MessageService.sendText(welcomeMessage)
```

## 🛡️ Security Architecture

### Permission System

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Owner       │───▶│     Admin       │───▶│     Public      │
│  (Full Access)  │    │ (Group Commands)│    │ (Basic Commands)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Middleware Stack

```javascript
// Auth middleware example
export default async function authMiddleware(context, next) {
    const { command, user, isGroup } = context;
    
    // Owner check
    if (command.ownerOnly && !isOwner(user)) {
        throw new Error('Owner only command');
    }
    
    // Admin check  
    if (command.adminOnly && !isAdmin(user, groupId)) {
        throw new Error('Admin only command');
    }
    
    // Group only check
    if (command.groupOnly && !isGroup) {
        throw new Error('Group only command');
    }
    
    await next();
}
```

## 💾 Data Architecture

### JSON Database Structure

```
database/
├── list-produk.json      # Simple product list for groups
├── produk.json           # Full product catalog  
├── list-testi.json       # Customer testimonials
├── sewa.json             # Premium users data
├── afk.json              # AFK status tracking
├── set_proses.json       # Order processing templates
├── set_done.json         # Order completion templates
├── welcome.json          # Welcome message settings
├── antilink.json         # Anti-link group settings
└── antilink2.json        # Alternative anti-link settings
```

### Data Consistency

```javascript
// All database operations use try-catch for safety
class DatabaseManager {
    async saveData(filename, data) {
        try {
            const backup = await this.loadData(filename);
            await fs.writeFile(filename, JSON.stringify(data, null, 2));
        } catch (error) {
            // Restore from backup if save fails
            await this.restoreBackup(filename, backup);
            throw error;
        }
    }
}
```

## 🔌 Plugin Architecture

### Command Structure

```javascript
// Standard command pattern
export default async function commandName(context, args) {
    try {
        // 1. Destructure context
        const { messageService, user, isGroup } = context;
        
        // 2. Validate input
        if (!args.length) {
            return messageService.reply('Usage: command <args>');
        }
        
        // 3. Business logic
        const result = await processCommand(args);
        
        // 4. Send response
        return messageService.reply(result);
        
    } catch (error) {
        logger.error('Command error:', error);
        return messageService.reply('An error occurred');
    }
}
```

### Adding New Commands

1. Create command file in appropriate category folder
2. Export default function following pattern
3. Register in `WhatsAppBot.js` loadCommands()
4. Add to documentation

## 🚀 Performance Considerations

### Async Operations

```javascript
// All I/O operations are async
async function loadAllData() {
    // Parallel loading for better performance
    const [products, testimonials, users] = await Promise.all([
        produkManager.getAll(),
        testiManager.getAll(), 
        sewaManager.getAll()
    ]);
    
    return { products, testimonials, users };
}
```

### Memory Management

- JSON files loaded on-demand
- Memory cleanup after operations
- Event listeners properly managed
- Connection pooling for API calls

### Rate Limiting

```javascript
// Built-in rate limiting
const rateLimiter = new Map();

function checkRateLimit(userId, command) {
    const key = `${userId}:${command}`;
    const lastUsed = rateLimiter.get(key);
    const now = Date.now();
    
    if (lastUsed && now - lastUsed < 1000) {
        throw new Error('Rate limited');
    }
    
    rateLimiter.set(key, now);
}
```

## 🔗 Integration Points

### WhatsApp Web API (Baileys)

```javascript
// Connection management
const { state, saveCreds } = await useMultiFileAuthState('session');
const client = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: ['KoalaStore Bot', 'Chrome', '91.0']
});
```

### External APIs

- **TikTok API** - Video download service
- **Free Fire API** - Player statistics
- **Mobile Legends API** - Player statistics  
- **Instagram API** - Profile information

## 📊 Monitoring & Logging

### Structured Logging

```javascript
// Using Pino for structured logs
logger.info({
    userId: user.id,
    command: commandName,
    args: args,
    responseTime: elapsed
}, 'Command executed');
```

### Health Checks

```javascript
// Express health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        connections: bot.client?.user ? 'Connected' : 'Disconnected'
    });
});
```

## 🔧 Configuration Management

### Environment-based Config

```javascript
// src/config/settings.js
export default {
    // Bot settings
    botName: process.env.BOT_NAME || 'KoalaStore Bot',
    ownerNumber: process.env.OWNER_NUMBER?.split(',') || [],
    
    // Feature flags
    features: {
        autoWelcome: process.env.AUTO_WELCOME === 'true',
        antiLink: process.env.ANTI_LINK === 'true',
        publicMode: process.env.PUBLIC_MODE !== 'false'
    },
    
    // API endpoints
    apis: {
        tiktok: process.env.TIKTOK_API_URL,
        freefire: process.env.FREEFIRE_API_URL
    }
};
```

## 🎯 Next Steps

Untuk memahami implementasi lebih detail:

1. **[Project Structure](./04-project-structure.md)** - File organization
2. **[API Reference](./06-api-reference.md)** - Detailed class documentation  
3. **[Creating Commands](./11-creating-commands.md)** - Build new features
4. **[Contributing Guide](./10-contributing.md)** - Development workflow

---

**💡 Tips untuk Developer:**
- Gunakan TypeScript untuk better development experience
- Implement unit tests untuk command functions
- Monitor memory usage pada production
- Backup database files secara berkala 