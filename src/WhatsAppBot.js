import baileys from "baileys";
const makeWASocket = baileys.default || baileys.makeWASocket;
const { useMultiFileAuthState, fetchLatestBaileysVersion } = baileys;
import pino from "pino";
import readline from "readline";
import { messageQueue as queue } from './utils/queue.js';
import fs from "fs";

import logger from "./utils/logger.js";
import config from "./config/settings.js";
import ListManager from "./models/ListManager.js";
import AfkManager from "./models/AfkManager.js";
import TestiManager from "./models/TestiManager.js";
import SewaManager from "./models/SewaManager.js";
import WelcomeManager from "./models/WelcomeManager.js";
import AntilinkManager from "./models/AntilinkManager.js";
import ProdukManager from "./models/ProdukManager.js";
import TemplateManager from "./models/TemplateManager.js";
import MessageService from "./services/MessageService.js";
import GroupService from "./services/GroupService.js";
import CommandHandler from "./handlers/CommandHandler.js";
import CommandRegistry from "./commands/registry/CommandRegistry.js";
import MessageHandler from "./handlers/MessageHandler.js";
import authMiddleware from "./middleware/authMiddleware.js";

// QRCode for connection
let QRCode;

class WhatsAppBot {
    constructor() {
        this.client = null;
        this.store = null;
        this.listManager = new ListManager();
        this.afkManager = new AfkManager();
        this.testiManager = new TestiManager();
        this.sewaManager = new SewaManager();
        this.welcomeManager = new WelcomeManager();
        this.antilinkManager = new AntilinkManager();
        this.produkManager = new ProdukManager();
        this.templateManager = new TemplateManager();
        this.services = {};
        this.commandHandler = new CommandHandler();
        this.commandRegistry = new CommandRegistry(this.commandHandler);
        this.messageHandler = null;
        
        // Connection state management to prevent loops
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000; // Start with 3 seconds
        this.isConnecting = false;
        this.lastDisconnectTime = 0;
        
        this.initializeStore();
        this.setupCommandHandler();
    }

    /**
     * Initialize message store
     */
    initializeStore() {
        // Memory store sudah tidak tersedia di Baileys 6.7.18+
        // Menggunakan simple in-memory storage untuk backwards compatibility
        this.store = {
            chats: new Map(),
            contacts: new Map(),
            messages: new Map(),
            
            // Method untuk bind ke socket events
            bind: (ev) => {
                ev.on('chats.upsert', (chats) => {
                    chats.forEach(chat => this.store.chats.set(chat.id, chat));
                });
                
                ev.on('contacts.upsert', (contacts) => {
                    contacts.forEach(contact => this.store.contacts.set(contact.id, contact));
                });
                
                ev.on('messages.upsert', ({ messages }) => {
                    messages.forEach(msg => {
                        if (msg.key?.id) {
                            this.store.messages.set(msg.key.id, msg);
                        }
                    });
                });
            }
        };
    }

    /**
     * Setup command handler with middleware
     */
    setupCommandHandler() {
        this.commandHandler.use(authMiddleware);
        // Commands will be loaded asynchronously
    }

    /**
     * Load all commands using CommandRegistry
     */
    async loadCommands() {
        try {
            logger.info('Loading commands using CommandRegistry...');
            const totalLoaded = await this.commandRegistry.loadAllCommands();
            logger.info(`Successfully loaded ${totalLoaded} commands automatically`);
            return totalLoaded;
        } catch (error) {
            logger.error('Error loading commands via CommandRegistry:', error);
            throw error;
        }
    }

    /**
     * Initialize services
     */
    initializeServices() {
        this.services = {
            messageService: new MessageService(this.client),
            groupService: new GroupService(this.client, this.welcomeManager),
            listManager: this.listManager,
            afkManager: this.afkManager,
            testiManager: this.testiManager,
            sewaManager: this.sewaManager,
            welcomeManager: this.welcomeManager,
            antilinkManager: this.antilinkManager,
            produkManager: this.produkManager,
            templateManager: this.templateManager
        };

        this.messageHandler = new MessageHandler(
            this.client,
            this.services,
            this.commandHandler
        );
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        // Connection updates - use queue to prevent race conditions
        this.client.ev.on("connection.update", (update) => {
            queue.add(() => this.handleConnectionUpdate(update));
        });

        // Messages - use queue for all message processing
        this.client.ev.on("messages.upsert", (m) => {
            queue.add(() => this.messageHandler.handleMessage(m));
        });

        // Group participant updates - use queue
        this.client.ev.on("group-participants.update", (update) => {
            queue.add(() => this.handleGroupUpdate(update));
        });

        // Store events - bind to client events
        this.store.bind(this.client.ev);
    }

    /**
     * Handle connection updates
     */
    async handleConnectionUpdate({ connection, lastDisconnect, qr }) {
        try {
            // Handle QR code display for NEW sessions only
            if (qr && !config.bot.usePairingCode) {
                // Only show QR if we don't have valid session
                const sessionPath = './sessionn';
                const credsPath = `${sessionPath}/creds.json`;
                
                if (!fs.existsSync(credsPath)) {
                    if (!QRCode) {
                        QRCode = (await import('qrcode-terminal')).default;
                    }
                    QRCode.generate(qr, { small: true });
                    logger.info('🔗 Scan QR code above to connect (first time setup)');
                } else {
                    logger.info('📱 QR generated but session exists - reconnecting...');
                }
            }

            switch (connection) {
                case "open":
                    logger.success(`✅ Bot connected as ${this.client.user?.id?.split(":")[0]}`);
                    // Reset reconnection attempts on successful connection
                    this.reconnectAttempts = 0;
                    this.reconnectDelay = 3000;
                    this.isConnecting = false;
                    break;
                case "close":
                    this.isConnecting = false;
                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    const currentTime = Date.now();
                    
                    // Prevent rapid reconnection attempts
                    if (currentTime - this.lastDisconnectTime < 5000) {
                        logger.warn("⏱️ Rapid disconnection detected, waiting before reconnect...");
                        this.lastDisconnectTime = currentTime;
                        return;
                    }
                    this.lastDisconnectTime = currentTime;
                    
                    if (statusCode === 401) {
                        // Session invalidated - manual logout or banned
                        logger.error("🚫 Session invalidated (logged out from another device or banned)");
                        logger.info("💡 Please delete sessionn folder and restart bot");
                        return;
                    } else if (statusCode === 403) {
                        // Device not authorized
                        logger.error("❌ Device not authorized - please re-authenticate");
                        logger.info("💡 Please delete sessionn folder and restart bot");
                        return;
                    } else if (statusCode === 428) {
                        // Connection replaced by another session
                        logger.warn("🔄 Connection replaced by another session");
                        logger.info("💡 Another WhatsApp session is active. Close other sessions first.");
                        return;
                    } else if (statusCode === 515) {
                        // Need to restart/refresh session
                        logger.warn("🔄 Session needs refresh - reconnecting...");
                        setTimeout(() => {
                            if (!this.isConnecting) {
                                this.attemptReconnect();
                            }
                        }, 2000);
                        return;
                    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                        // Max reconnection attempts reached
                        logger.error(`❌ Max reconnection attempts (${this.maxReconnectAttempts}) reached. Stopping bot.`);
                        logger.info("💡 Please check your internet connection and restart manually");
                        return;
                    } else {
                        // Attempt reconnection with exponential backoff
                        this.reconnectAttempts++;
                        const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000); // Max 30s
                        
                        logger.warn(`🔄 Connection closed (${statusCode || 'unknown'}), attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay/1000}s...`);
                        
                        setTimeout(() => {
                            if (!this.isConnecting) {
                                this.attemptReconnect();
                            }
                        }, delay);
                    }
                    break;
                case "connecting":
                    if (!this.isConnecting) {
                        this.isConnecting = true;
                        logger.info("🔗 Connecting to WhatsApp...");
                    }
                    break;
            }
        } catch (error) {
            logger.error("Error handling connection update:", error);
        }
    }

    /**
     * Attempt to reconnect with proper state management
     */
    async attemptReconnect() {
        if (this.isConnecting) {
            logger.debug("Reconnection already in progress, skipping...");
            return;
        }
        
        try {
            this.isConnecting = true;
            logger.info("Attempting to reconnect...");
            await this.start();
        } catch (error) {
            this.isConnecting = false;
            logger.error("Reconnection failed:", error.message);
        }
    }

    /**
     * Handle group participant updates
     */
    async handleGroupUpdate(update) {
        try {
            const isWelcome = this.services.groupService.isWelcomeEnabled(update.id);
            if (!isWelcome) return;

            const metadata = await this.services.groupService.getGroupMetadata(update.id);
            if (!metadata) return;

            for (const participant of update.participants) {
                switch (update.action) {
                    case "add":
                        await this.services.messageService.sendWelcome(
                            update.id,
                            participant,
                            metadata.subject
                        );
                        break;
                    case "remove":
                        await this.services.messageService.sendGoodbye(
                            update.id,
                            participant,
                            metadata.subject
                        );
                        break;
                    case "promote":
                        await this.services.messageService.sendPromotion(
                            update.id,
                            participant,
                            metadata.subject
                        );
                        break;
                    case "demote":
                        await this.services.messageService.sendDemotion(
                            update.id,
                            participant,
                            metadata.subject
                        );
                        break;
                }
            }
        } catch (error) {
            logger.error("Error handling group update", error);
        }
    }

    /**
     * Get pairing code
     */
    async getPairingCode() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve) => {
            rl.question("Masukkan nomor WhatsApp (awali dengan 62): ", (phone) => {
                rl.close();
                resolve(phone.trim());
            });
        });
    }

    /**
     * Start the bot
     */
    async start() {
        try {
            logger.info("Starting WhatsApp Bot...");

            // Setup authentication
            const { state, saveCreds } = await useMultiFileAuthState(config.paths.session);
            const { version } = await fetchLatestBaileysVersion();

            // Create WhatsApp socket
            this.client = makeWASocket({
                logger: pino({ level: "silent" }),
                auth: state,
                browser: ["KoalaStore Bot", "Desktop", "1.0.0"],
                version
            });

            // Setup pairing code ONLY for new sessions (no existing creds)
            const credsPath = `${config.paths.session}/creds.json`;
            if (config.bot.usePairingCode && !fs.existsSync(credsPath)) {
                const phoneNumber = await this.getPairingCode();
                const code = await this.client.requestPairingCode(phoneNumber);
                logger.info(`📱 Pairing code: ${code}`);
            } else if (config.bot.usePairingCode && fs.existsSync(credsPath)) {
                logger.info('🔗 Using existing session - skipping pairing code');
            }

            // Initialize services and handlers
            this.initializeServices();
            this.setupEventHandlers();

            // Load commands asynchronously
            await this.loadCommands();

            // Save credentials on update
            this.client.ev.on("creds.update", saveCreds);

            logger.success("WhatsApp Bot initialized successfully!");

        } catch (error) {
            logger.error("Failed to start bot", error);
            process.exit(1);
        }
    }

    /**
     * Stop the bot gracefully while preserving session
     */
    async stop() {
        try {
            if (this.client) {
                // Gracefully close connection without destroying session
                // Use close() instead of end() to properly clean up
                await this.client.ws.close();
                this.client = null;
                logger.info("✅ Bot stopped successfully (session preserved)");
            }
        } catch (error) {
            logger.error("❌ Error stopping bot", error);
            // Force close if graceful close fails
            if (this.client) {
                this.client = null;
            }
        }
    }

    /**
     * Force logout and destroy session (use only when needed)
     */
    async forceLogout() {
        try {
            if (this.client) {
                await this.client.logout();
                this.client = null;
                logger.info("Bot logged out and session destroyed");
            }
        } catch (error) {
            logger.error("Error during force logout", error);
        }
    }
}

export default WhatsAppBot; 