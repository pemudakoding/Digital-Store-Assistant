#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function banner() {
    log(`
  _  __           _       ____  _                   
 | |/ /___   __ _| | __ _/ ___|| |_ ___  _ __ ___   
 | ' // _ \\ / _\` | |/ _\` \\___ \\| __/ _ \\| '__/ _ \\  
 | . \\ (_) | (_| | | (_| |___) | || (_) | | |  __/  
 |_|\\_\\___/ \\__,_|_|\\__,_|____/ \\__\\___/|_|  \\___|  
                                                    
 🐨 KOALA STORE BOT - Clean Startup Script
`, 'cyan');
}

async function checkSession() {
    const sessionPath = path.join(__dirname, 'sessionn');
    
    if (fs.existsSync(sessionPath)) {
        log('📁 Session folder found', 'yellow');
        
        // Check if session is corrupted (has creds.json but connection issues)
        const credsPath = path.join(sessionPath, 'creds.json');
        if (fs.existsSync(credsPath)) {
            try {
                const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
                if (!creds.registered) {
                    log('⚠️  Session appears corrupted (not registered)', 'yellow');
                    return false;
                }
                log('✅ Session appears valid', 'green');
                return true;
            } catch (error) {
                log('❌ Session credentials corrupted', 'red');
                return false;
            }
        }
    }
    
    log('🆕 No session found - will create new session', 'blue');
    return true;
}

async function cleanSession() {
    const sessionPath = path.join(__dirname, 'sessionn');
    
    if (fs.existsSync(sessionPath)) {
        log('🧹 Cleaning corrupted session...', 'yellow');
        try {
            fs.rmSync(sessionPath, { recursive: true, force: true });
            log('✅ Session cleaned successfully', 'green');
        } catch (error) {
            log(`❌ Failed to clean session: ${error.message}`, 'red');
            process.exit(1);
        }
    }
}

async function startBot() {
    try {
        log('🚀 Starting KoalaStore Bot...', 'green');
        
        // Import and start the bot
        const { default: WhatsAppBot } = await import('./src/WhatsAppBot.js');
        const bot = new WhatsAppBot();
        
        // Graceful shutdown handling
        process.on('SIGINT', async () => {
            log('\n🛑 Received SIGINT, shutting down gracefully...', 'yellow');
            await bot.stop();
            process.exit(0);
        });
        
        process.on('SIGTERM', async () => {
            log('\n🛑 Received SIGTERM, shutting down gracefully...', 'yellow');
            await bot.stop();
            process.exit(0);
        });
        
        // Start the bot
        await bot.start();
        
    } catch (error) {
        log(`❌ Failed to start bot: ${error.message}`, 'red');
        console.error(error);
        process.exit(1);
    }
}

async function main() {
    banner();
    
    log('🔍 Checking system...', 'blue');
    
    // Check for Node.js processes
    if (process.platform === 'win32') {
        const { execSync } = await import('child_process');
        try {
            const result = execSync('tasklist | findstr node.exe', { encoding: 'utf8' });
            if (result.trim()) {
                log('⚠️  Other Node.js processes detected:', 'yellow');
                console.log(result);
                log('💡 Consider running: taskkill /F /IM node.exe', 'cyan');
                log('🤔 Continue anyway? (y/N)', 'yellow');
                
                // Simple prompt
                process.stdin.setRawMode(true);
                process.stdin.resume();
                const key = await new Promise(resolve => {
                    process.stdin.once('data', resolve);
                });
                process.stdin.setRawMode(false);
                process.stdin.pause();
                
                if (key.toString().toLowerCase() !== 'y') {
                    log('👋 Startup cancelled', 'yellow');
                    process.exit(0);
                }
            }
        } catch (error) {
            // No other node processes, continue
        }
    }
    
    // Check session
    const sessionValid = await checkSession();
    
    if (!sessionValid) {
        log('🔧 Would you like to clean the corrupted session? (Y/n)', 'yellow');
        
        // Simple prompt
        process.stdin.setRawMode(true);
        process.stdin.resume();
        const key = await new Promise(resolve => {
            process.stdin.once('data', resolve);
        });
        process.stdin.setRawMode(false);
        process.stdin.pause();
        
        const response = key.toString().toLowerCase();
        if (response === 'y' || response === '\r') {
            await cleanSession();
        }
    }
    
    // Start the bot
    await startBot();
}

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
    log(`❌ Unhandled Rejection at: ${promise}, reason: ${reason}`, 'red');
});

process.on('uncaughtException', (error) => {
    log(`❌ Uncaught Exception: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});

// Run the main function
main().catch(error => {
    log(`❌ Startup failed: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
}); 