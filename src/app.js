#!/usr/bin/env node

/**
 * KoalaStore Bot - Production Entry Point
 * Non-interactive startup for PM2 and production environments
 */

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
    cyan: '\x1b[36m'
};

function log(message, color = 'white') {
    const timestamp = new Date().toISOString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function banner() {
    log(`
  _  __           _       ____  _                   
 | |/ /___   __ _| | __ _/ ___|| |_ ___  _ __ ___   
 | ' // _ \\ / _\` | |/ _\` \\___ \\| __/ _ \\| '__/ _ \\  
 | . \\ (_) | (_| | | (_| |___) | || (_) | | |  __/  
 |_|\\_\\___/ \\__,_|_|\\__,_|____/ \\__\\___/|_|  \\___|  
                                                    
 🐨 KOALA STORE BOT v2.0.0 - Production Mode
 🚀 Auto-starting without user interaction...
`, 'cyan');
}

async function checkEnvironment() {
    log('🔍 Checking production environment...', 'blue');
    
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 20) {
        log(`❌ Node.js version ${nodeVersion} is too old. Requires Node.js 20+`, 'red');
        process.exit(1);
    }
    
    log(`✅ Node.js ${nodeVersion} - OK`, 'green');
    
    // Check essential directories
    const requiredDirs = ['database', 'gambar', 'src'];
    for (const dir of requiredDirs) {
        if (!fs.existsSync(dir)) {
            log(`❌ Required directory missing: ${dir}`, 'red');
            process.exit(1);
        }
    }
    
    log('✅ Required directories - OK', 'green');
    
    // Check essential files
    const requiredFiles = ['setting.js', 'src/WhatsAppBot.js'];
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            log(`❌ Required file missing: ${file}`, 'red');
            process.exit(1);
        }
    }
    
    log('✅ Required files - OK', 'green');
}

async function autoCleanSession() {
    const sessionPath = path.join(process.cwd(), 'sessionn');
    
    if (!fs.existsSync(sessionPath)) {
        log('🆕 No existing session found - will create new session', 'blue');
        return;
    }
    
    log('📁 Existing session found - validating...', 'yellow');
    
    // Check if session has valid credentials
    const credsPath = path.join(sessionPath, 'creds.json');
    if (!fs.existsSync(credsPath)) {
        log('❌ Session missing credentials file', 'yellow');
        await cleanAndCreateSession(sessionPath);
        return;
    }
    
    try {
        const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
        
        // Check for essential session data (more reliable than just 'registered' flag)
        const hasValidData = creds.noiseKey && 
                            creds.signedIdentityKey && 
                            creds.me && 
                            creds.me.id &&
                            creds.signalIdentities &&
                            creds.signalIdentities.length > 0;
        
        if (hasValidData) {
            log(`✅ Session is valid (User: ${creds.me.name || 'Unknown'})`, 'green');
            log('🔗 Keeping existing session and connecting...', 'green');
            return;
        } else {
            log('⚠️ Session incomplete or corrupted', 'yellow');
            await cleanAndCreateSession(sessionPath);
            return;
        }
        
    } catch (error) {
        log(`⚠️ Session credentials corrupted: ${error.message}`, 'yellow');
        await cleanAndCreateSession(sessionPath);
        return;
    }
}

async function cleanAndCreateSession(sessionPath) {
    log('🧹 Auto-cleaning corrupted session...', 'yellow');
    try {
        fs.rmSync(sessionPath, { recursive: true, force: true });
        log('✅ Session cleaned - will create new session', 'green');
    } catch (error) {
        log(`❌ Failed to clean session: ${error.message}`, 'red');
        process.exit(1);
    }
}

async function startBot() {
    try {
        log('🚀 Initializing KoalaStore Bot...', 'green');
        
        // Import bot class
        const { default: WhatsAppBot } = await import('./WhatsAppBot.js');
        
        // Create bot instance
        const bot = new WhatsAppBot();
        
        // Setup graceful shutdown
        const gracefulShutdown = async (signal) => {
            log(`\n🛑 Received ${signal}, shutting down gracefully...`, 'yellow');
            try {
                await bot.stop();
                log('✅ Bot stopped successfully', 'green');
                process.exit(0);
            } catch (error) {
                log(`❌ Error during shutdown: ${error.message}`, 'red');
                process.exit(1);
            }
        };
        
        // Handle various shutdown signals
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // PM2 reload
        
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            log(`❌ Uncaught Exception: ${error.message}`, 'red');
            console.error(error.stack);
            process.exit(1);
        });
        
        process.on('unhandledRejection', (reason, promise) => {
            log(`❌ Unhandled Rejection at: ${promise}`, 'red');
            log(`❌ Reason: ${reason}`, 'red');
            process.exit(1);
        });
        
        // Start the bot
        log('🔗 Starting WhatsApp connection...', 'blue');
        await bot.start();
        
        log('🎉 KoalaStore Bot started successfully!', 'green');
        log('📱 Bot is now online and ready to serve customers', 'green');
        
        // Keep process alive
        process.stdin.resume();
        
    } catch (error) {
        log(`❌ Failed to start bot: ${error.message}`, 'red');
        console.error(error.stack);
        process.exit(1);
    }
}

async function main() {
    // Show banner
    banner();
    
    // Environment checks
    await checkEnvironment();
    
    // Auto session management
    await autoCleanSession();
    
    // Start bot
    await startBot();
}

// Production environment settings
if (process.env.NODE_ENV !== 'development') {
    // Disable warnings in production
    process.env.NODE_NO_WARNINGS = '1';
    
    // Set timezone
    process.env.TZ = 'Asia/Jakarta';
}

// Start the application
main().catch(error => {
    log(`❌ Startup failed: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
}); 