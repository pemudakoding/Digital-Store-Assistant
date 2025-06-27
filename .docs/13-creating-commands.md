# 🛠️ Creating Commands

Panduan lengkap untuk membuat command baru di KoalaStore WhatsApp Bot.

## 🎯 Command Structure

### Basic Command Template

```javascript
/**
 * Command Name - Brief description
 * Usage: commandname <parameters>
 * Category: general/admin/owner/store/calculator
 */
export default async function commandName(context) {
    const { 
        messageService, 
        from, 
        msg, 
        args, 
        fullArgs,
        sender,
        isGroup,
        isAdmin,
        isOwner,
        quotedMsg
    } = context;
    
    try {
        // 1. Input validation
        if (!args.length) {
            const usage = "Usage: commandname <parameter>";
            return await messageService.reply(from, usage, msg);
        }
        
        // 2. Permission checks (if needed)
        if (isAdminCommand && !isAdmin && !isOwner) {
            return await messageService.reply(from, mess.adminOnly, msg);
        }
        
        // 3. Command logic
        const result = await processCommand(args);
        
        // 4. Send response
        await messageService.reply(from, result, msg);
        
    } catch (error) {
        console.error(`Error in ${commandName}:`, error);
        await messageService.sendError(from, 'general', msg);
    }
}
```

## 📁 File Organization

### 1. Choose Category

Commands diorganisir dalam folder kategori:

```
src/commands/
├── general/      # Public commands
├── admin/        # Group admin commands  
├── owner/        # Bot owner commands
├── store/        # Store-related commands
└── calculator/   # Math operations
```

### 2. File Naming

- Format: `commandname.js`
- Lowercase, single word jika memungkinkan
- Contoh: `ping.js`, `addlist.js`, `socialmedia.js`

### 3. Create Command File

```bash
# Example: Create new general command
touch src/commands/general/mycommand.js
```

## 🎮 Command Examples

### 1. Simple Text Command

```javascript
/**
 * About command - Show bot information
 * Usage: about
 */
export default async function aboutCommand(context) {
    const { messageService, from, msg } = context;
    
    const aboutText = `
🤖 *KoalaStore Bot*

Version: 2.0.0
Developer: KoalaStore Team
Purpose: Digital store management

📝 Features:
• Product management
• Order processing  
• Customer service automation
• Admin tools

Type *help* for commands list.
    `.trim();
    
    await messageService.reply(from, aboutText, msg);
}
```

### 2. Command with Parameters

```javascript
/**
 * Echo command - Repeat user message
 * Usage: echo <message>
 */
export default async function echoCommand(context) {
    const { messageService, from, msg, args, fullArgs } = context;
    
    if (!fullArgs) {
        return await messageService.reply(from, "Usage: echo <message>", msg);
    }
    
    const response = `🔊 *Echo:*\n${fullArgs}`;
    await messageService.reply(from, response, msg);
}
```

### 3. Admin Command with Permission Check

```javascript
/**
 * Announce command - Send announcement to group
 * Usage: announce <message>
 */
export default async function announceCommand(context) {
    const { messageService, from, msg, args, fullArgs, isGroup, isAdmin, isOwner } = context;
    
    // Group only check
    if (!isGroup) {
        return await messageService.reply(from, "This command can only be used in groups!", msg);
    }
    
    // Admin permission check
    if (!isAdmin && !isOwner) {
        return await messageService.reply(from, "Only group admins can use this command!", msg);
    }
    
    // Input validation
    if (!fullArgs) {
        return await messageService.reply(from, "Usage: announce <message>", msg);
    }
    
    // Create announcement
    const announcement = `
📢 *GROUP ANNOUNCEMENT*

${fullArgs}

_Announced by admin_
    `.trim();
    
    await messageService.reply(from, announcement, msg);
}
```

### 4. Command with Database Operations

```javascript
/**
 * Save Note command - Save note to database
 * Usage: savenote <title>|<content>
 */
export default async function saveNoteCommand(context) {
    const { messageService, from, msg, args, databaseManager } = context;
    
    // Parse pipe-separated arguments
    if (args.length < 2) {
        const usage = `
*Usage:* savenote <title>|<content>

*Example:*
savenote Meeting Notes|Important discussion about project timeline
        `.trim();
        return await messageService.reply(from, usage, msg);
    }
    
    const title = args[0];
    const content = args.slice(1).join('|');
    
    try {
        // Load existing notes
        const notes = databaseManager.getDatabase('notes') || [];
        
        // Create new note
        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            author: context.sender,
            createdAt: new Date().toISOString()
        };
        
        // Save to database
        notes.push(newNote);
        databaseManager.saveDatabase('notes', notes);
        
        const response = `
✅ *Note Saved!*

📝 Title: ${title}
📄 Content: ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}
🕒 Created: ${new Date().toLocaleString()}
        `.trim();
        
        await messageService.reply(from, response, msg);
        
    } catch (error) {
        console.error('Error saving note:', error);
        await messageService.reply(from, "❌ Failed to save note!", msg);
    }
}
```

### 5. Command with External API

```javascript
/**
 * Weather command - Get weather information
 * Usage: weather <city>
 */
export default async function weatherCommand(context) {
    const { messageService, from, msg, args } = context;
    
    if (!args.length) {
        return await messageService.reply(from, "Usage: weather <city>", msg);
    }
    
    const city = args.join(' ');
    
    try {
        // Send "processing" message
        await messageService.reply(from, "🌤️ Getting weather data...", msg);
        
        // Mock API call (replace with real API)
        const weatherData = await fetchWeatherData(city);
        
        if (!weatherData) {
            return await messageService.reply(from, `❌ Weather data not found for "${city}"`, msg);
        }
        
        const response = `
🌤️ *Weather in ${weatherData.city}*

🌡️ Temperature: ${weatherData.temperature}°C
💧 Humidity: ${weatherData.humidity}%
🌪️ Wind: ${weatherData.windSpeed} km/h
📖 Condition: ${weatherData.condition}

_Updated: ${new Date().toLocaleString()}_
        `.trim();
        
        await messageService.reply(from, response, msg);
        
    } catch (error) {
        console.error('Weather API error:', error);
        await messageService.reply(from, "❌ Failed to get weather data!", msg);
    }
}

// Mock function - replace with real API call
async function fetchWeatherData(city) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    return {
        city: city,
        temperature: Math.floor(Math.random() * 35) + 15,
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 20) + 5,
        condition: "Partly Cloudy"
    };
}
```

### 6. Media Processing Command

```javascript
/**
 * Quote command - Create quote image
 * Usage: quote <text>
 */
export default async function quoteCommand(context) {
    const { messageService, mediaService, from, msg, fullArgs } = context;
    
    if (!fullArgs) {
        return await messageService.reply(from, "Usage: quote <text>", msg);
    }
    
    try {
        await messageService.reply(from, "🎨 Creating quote image...", msg);
        
        // Create quote image using MediaService
        const quoteImage = await mediaService.createQuoteImage({
            text: fullArgs,
            author: "KoalaStore Bot",
            background: "gradient"
        });
        
        // Send image
        await messageService.sendImage(from, quoteImage, "Here's your quote! 📝", msg);
        
    } catch (error) {
        console.error('Quote creation error:', error);
        await messageService.reply(from, "❌ Failed to create quote image!", msg);
    }
}
```

## 🔧 Register Command

### 1. Add to WhatsAppBot.js

```javascript
// In WhatsAppBot.js loadCommands() method
this.commandHandler.register('mycommand', {
    description: 'Description of my command',
    usage: 'mycommand <parameters>',
    category: 'general',
    aliases: ['mycmd', 'mc'],
    ownerOnly: false,
    adminOnly: false,
    groupOnly: false,
    privateOnly: false
}, (await import('./commands/general/mycommand.js')).default);
```

### 2. Command Configuration Options

```javascript
{
    description: 'Command description',    // Shows in help
    usage: 'command <params>',            // Usage format
    category: 'general',                  // Command category
    aliases: ['alias1', 'alias2'],       // Alternative names
    ownerOnly: false,                     // Owner-only command
    adminOnly: false,                     // Admin-only command  
    groupOnly: false,                     // Group-only command
    privateOnly: false,                   // Private chat only
    premiumOnly: false                    // Premium users only
}
```

## 🎨 Advanced Features

### 1. Interactive Commands

```javascript
/**
 * Quiz command - Interactive quiz
 * Usage: quiz
 */
export default async function quizCommand(context) {
    const { messageService, from, msg, sender } = context;
    
    const questions = [
        {
            question: "What is the capital of Indonesia?",
            options: ["A. Jakarta", "B. Bandung", "C. Surabaya"],
            correct: "A"
        }
        // ... more questions
    ];
    
    const currentQuestion = questions[0];
    
    const quiz = `
🧠 *QUIZ TIME!*

Question 1/5:
${currentQuestion.question}

${currentQuestion.options.join('\n')}

Reply with A, B, or C
    `.trim();
    
    await messageService.reply(from, quiz, msg);
    
    // Store quiz state for user
    // (This would need a more sophisticated state management system)
}
```

### 2. Scheduled Commands

```javascript
/**
 * Reminder command - Set reminder
 * Usage: reminder <minutes>|<message>
 */
export default async function reminderCommand(context) {
    const { messageService, from, msg, args } = context;
    
    if (args.length < 2) {
        return await messageService.reply(from, "Usage: reminder <minutes>|<message>", msg);
    }
    
    const minutes = parseInt(args[0]);
    const message = args[1];
    
    if (isNaN(minutes) || minutes <= 0) {
        return await messageService.reply(from, "Please provide valid number of minutes!", msg);
    }
    
    // Set reminder
    setTimeout(async () => {
        const reminder = `
⏰ *REMINDER*

${message}

_Set ${minutes} minute(s) ago_
        `.trim();
        
        await messageService.reply(from, reminder);
    }, minutes * 60 * 1000);
    
    await messageService.reply(from, `⏰ Reminder set for ${minutes} minute(s)!`, msg);
}
```

### 3. Multi-step Commands

```javascript
/**
 * Survey command - Multi-step survey
 * Usage: survey
 */
export default async function surveyCommand(context) {
    const { messageService, from, msg, sender } = context;
    
    // This would need a state management system
    const surveyState = {
        userId: sender,
        currentStep: 0,
        answers: []
    };
    
    const questions = [
        "What's your name?",
        "How old are you?", 
        "What's your favorite color?"
    ];
    
    const currentQuestion = questions[surveyState.currentStep];
    
    const response = `
📋 *SURVEY* (Step ${surveyState.currentStep + 1}/${questions.length})

${currentQuestion}

Type your answer:
    `.trim();
    
    await messageService.reply(from, response, msg);
    
    // Store state for next interaction
    // (Implementation depends on your state management approach)
}
```

## 🔍 Testing Commands

### 1. Manual Testing

```bash
# Start bot in development
npm run dev

# Test in WhatsApp
mycommand test parameter
```

### 2. Test Different Scenarios

```javascript
// Test different input scenarios:
mycommand                    // No parameters
mycommand param1             // Single parameter  
mycommand param1 param2      // Multiple parameters
mycommand param1|param2      // Pipe-separated
```

### 3. Test Permissions

```javascript
// Test as different user types:
// - Regular user
// - Group admin
// - Bot owner
// - In group vs private chat
```

## 📝 Documentation

### 1. Update Commands Guide

Add your command to `.docs/07-commands.md`:

```markdown
| `mycommand` | `mycmd` | Description of command | `mycommand <param>` |
```

### 2. Add Usage Examples

```markdown
#### My Command
```
mycommand Hello World
// Expected output: Response with processed "Hello World"
```
```

### 3. Update Help Menu

Command akan otomatis muncul di help menu berdasarkan category dan permissions.

## 🚀 Best Practices

### 1. Error Handling

```javascript
try {
    // Command logic
} catch (error) {
    console.error(`Error in ${commandName}:`, error);
    
    // User-friendly error message
    if (error.message.includes('permission')) {
        await messageService.reply(from, "❌ Permission denied!", msg);
    } else {
        await messageService.sendError(from, 'general', msg);
    }
}
```

### 2. Input Validation

```javascript
// Validate required parameters
if (!args.length) {
    return await messageService.reply(from, "Usage: command <param>", msg);
}

// Validate parameter format
if (!isValidEmail(args[0])) {
    return await messageService.reply(from, "Please provide valid email!", msg);
}

// Validate permissions
if (command.ownerOnly && !isOwner) {
    return await messageService.reply(from, mess.ownerOnly, msg);
}
```

### 3. Response Formatting

```javascript
// Use consistent formatting
const response = `
✅ *Success!*

📝 Title: ${data.title}
📄 Description: ${data.description}
🕒 Created: ${new Date().toLocaleString()}

_Type help for more commands_
`.trim();
```

### 4. Performance Considerations

```javascript
// For heavy operations, show progress
await messageService.reply(from, "⏳ Processing...", msg);

// Use async/await properly
const result = await heavyOperation();

// Clean up resources
if (tempFile) {
    fs.unlinkSync(tempFile);
}
```

## 🎯 Next Steps

1. **Study existing commands** di folder `src/commands/`
2. **Pick a category** yang sesuai untuk command Anda
3. **Create command file** dengan template yang sesuai
4. **Register command** di `WhatsAppBot.js`
5. **Test thoroughly** dengan skenario berbeda
6. **Update documentation** dan submit PR

---

**Tips:** Mulai dengan command sederhana dulu, lalu gradually tambah complexity! 🚀 