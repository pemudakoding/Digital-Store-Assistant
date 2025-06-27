# 📚 API Reference

Complete API documentation for KoalaStore WhatsApp Bot classes and methods.

## 🏗️ Core Classes

### WhatsAppBot

**Location:** `src/WhatsAppBot.js`

Main bot class that orchestrates all components.

#### Constructor

```javascript
constructor()
```

**Description:** Initialize all managers, services, and handlers.

#### Methods

##### start()

```javascript
async start()
```

**Description:** Start the bot and connect to WhatsApp.

**Returns:** `Promise<void>`

##### stop()

```javascript
async stop()
```

**Description:** Gracefully stop the bot and close connections.

**Returns:** `Promise<void>`

---

## 🎯 Handlers

### CommandHandler

**Location:** `src/handlers/CommandHandler.js`

Manages command registration and execution.

#### Methods

##### register()

```javascript
register(name, options, handler)
```

**Parameters:**
- `name` (string): Command name
- `options` (object): Command configuration
- `handler` (function): Command handler function

**Example:**
```javascript
commandHandler.register('help', {
    description: 'Show help menu',
    category: 'general',
    aliases: ['menu']
}, helpCommand);
```

---

## 📧 Services

### MessageService

**Location:** `src/services/MessageService.js`

Handles all WhatsApp message operations.

#### Methods

##### reply()

```javascript
async reply(jid, text, quoted)
```

**Parameters:**
- `jid` (string): Chat ID
- `text` (string): Message text
- `quoted` (object, optional): Message to quote

**Returns:** `Promise<WAMessage>`

---

## 💾 Data Managers

### ListManager

**Location:** `src/models/ListManager.js`

Manages simple product lists for groups.

#### Methods

##### addList()

```javascript
async addList(name, description)
```

**Parameters:**
- `name` (string): Product name
- `description` (string): Product description

**Returns:** `Promise<void>`

##### getList()

```javascript
async getList()
```

**Returns:** `Promise<Array>`

---

**📄 API Version:** 2.0.0  
**Last Updated:** December 2024 