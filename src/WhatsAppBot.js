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
     * Load all commands
     */
    async loadCommands() {
        try {
            // General commands
            this.commandHandler.register('help', {
                description: 'Menampilkan menu bantuan',
                category: 'general',
                aliases: ['koalaaa']
            }, (await import('./commands/general/help.js')).default);

            this.commandHandler.register('allmenu', {
                description: 'Menampilkan semua menu',
                category: 'general'
            }, (await import('./commands/general/allmenu.js')).default);

            this.commandHandler.register('ping', {
                description: 'Cek status bot',
                category: 'general'
            }, (await import('./commands/general/ping.js')).default);

            this.commandHandler.register('donasi', {
                description: 'Informasi donasi',
                category: 'general',
                aliases: ['donate']
            }, (await import('./commands/general/donasi.js')).default);

            this.commandHandler.register('sticker', {
                description: 'Convert gambar/video ke sticker',
                category: 'general',
                aliases: ['s', 'stiker']
            }, (await import('./commands/general/sticker.js')).default);

            this.commandHandler.register('ffstalk', {
                description: 'Cek info player Free Fire',
                category: 'general'
            }, (await import('./commands/general/ffstalk.js')).default);

            this.commandHandler.register('mlstalk', {
                description: 'Cek info player Mobile Legends',
                category: 'general'
            }, (await import('./commands/general/mlstalk.js')).default);

            this.commandHandler.register('owner', {
                description: 'Info kontak owner',
                category: 'general'
            }, (await import('./commands/general/owner.js')).default);

            this.commandHandler.register('tiktok', {
                description: 'Download video TikTok',
                category: 'general',
                aliases: ['tiktokowner']
            }, (await import('./commands/general/tiktok.js')).default);

            this.commandHandler.register('tiktokaudio', {
                description: 'Download audio TikTok',
                category: 'general',
                aliases: ['tiktokaudiobot']
            }, (await import('./commands/general/tiktokaudio.js')).default);

            this.commandHandler.register('afk', {
                description: 'Set status AFK',
                category: 'general',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/general/afk.js')).default);

            this.commandHandler.register('cekafk', {
                description: 'Cek siapa yang sedang AFK',
                category: 'general',
                groupOnly: true
            }, (await import('./commands/general/cekafk.js')).default);

            this.commandHandler.register('previewlist', {
                description: 'Preview produk dengan gambar',
                category: 'general',
                aliases: ['preview'],
                groupOnly: true
            }, (await import('./commands/general/previewlist.js')).default);

            // Calculator commands
            this.commandHandler.register('tambah', {
                description: 'Tambah dua angka',
                category: 'calculator'
            }, (await import('./commands/calculator/tambah.js')).default);

            this.commandHandler.register('kurang', {
                description: 'Kurang dua angka', 
                category: 'calculator'
            }, (await import('./commands/calculator/kurang.js')).default);

            this.commandHandler.register('kali', {
                description: 'Kali dua angka',
                category: 'calculator'
            }, (await import('./commands/calculator/kali.js')).default);

            this.commandHandler.register('bagi', {
                description: 'Bagi dua angka',
                category: 'calculator'
            }, (await import('./commands/calculator/bagi.js')).default);

            // Store commands
            this.commandHandler.register('list', {
                description: 'Menampilkan daftar produk',
                category: 'store',
                aliases: ['shop']
            }, (await import('./commands/store/list.js')).default);

            this.commandHandler.register('testi', {
                description: 'Tampilkan list testimoni',
                category: 'store',
                privateOnly: true
            }, (await import('./commands/store/testi.js')).default);

            this.commandHandler.register('produk', {
                description: 'Tampilkan list produk',
                category: 'store',
                aliases: ['listproduk'],
                privateOnly: true
            }, (await import('./commands/store/produk.js')).default);

            // Admin commands
            this.commandHandler.register('addlist', {
                description: 'Tambah item ke list',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/addlist.js')).default);

            this.commandHandler.register('dellist', {
                description: 'Hapus item dari list',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/dellist.js')).default);

            this.commandHandler.register('hidetag', {
                description: 'Tag semua member tersembunyi',
                category: 'admin',
                aliases: ['h'],
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/hidetag.js')).default);

            this.commandHandler.register('tagall', {
                description: 'Tag semua member',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/tagall.js')).default);

            this.commandHandler.register('kick', {
                description: 'Kick member dari grup',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/kick.js')).default);

            this.commandHandler.register('groupsetting', {
                description: 'Buka/tutup grup',
                category: 'admin',
                aliases: ['group', 'grup'],
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/group.js')).default);

            this.commandHandler.register('proses', {
                description: 'Tandai pesanan sedang diproses',
                category: 'admin',
                aliases: ['p'],
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/proses.js')).default);

            this.commandHandler.register('done', {
                description: 'Tandai pesanan selesai',
                category: 'admin',
                aliases: ['d'],
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/done.js')).default);

            this.commandHandler.register('unafk', {
                description: 'Hapus status AFK user lain',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/unafk.js')).default);

            this.commandHandler.register('removeimage', {
                description: 'Hapus gambar dari produk list',
                category: 'admin',
                aliases: ['delimage'],
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/removeimage.js')).default);

            // Owner commands
            this.commandHandler.register('broadcast', {
                description: 'Broadcast pesan',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/broadcast.js')).default);

            this.commandHandler.register('mode', {
                description: 'Switch bot mode',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/mode.js')).default);

            this.commandHandler.register('join', {
                description: 'Join grup via link',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/join.js')).default);

            this.commandHandler.register('block', {
                description: 'Block user',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/block.js')).default);

            this.commandHandler.register('unblock', {
                description: 'Unblock user',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/unblock.js')).default);

            this.commandHandler.register('addsewa', {
                description: 'Tambah grup sewa',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/addsewa.js')).default);

            this.commandHandler.register('delsewa', {
                description: 'Hapus grup sewa',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/delsewa.js')).default);

            this.commandHandler.register('listsewa', {
                description: 'List grup sewa',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/listsewa.js')).default);

            this.commandHandler.register('addtesti', {
                description: 'Tambah testimoni',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/addtesti.js')).default);

            this.commandHandler.register('deltesti', {
                description: 'Hapus testimoni',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/deltesti.js')).default);

            // More admin commands
            this.commandHandler.register('antilink', {
                description: 'Toggle antilink',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/antilink.js')).default);

            this.commandHandler.register('antilink2', {
                description: 'Toggle antilink2',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/antilink2.js')).default);

            this.commandHandler.register('welcome', {
                description: 'Toggle welcome message',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/welcome.js')).default);

            this.commandHandler.register('delete', {
                description: 'Delete message',
                category: 'admin',
                aliases: ['del'],
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/delete.js')).default);

            this.commandHandler.register('linkgc', {
                description: 'Get group link',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/linkgrup.js')).default);

            this.commandHandler.register('revoke', {
                description: 'Revoke group link',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/revoke.js')).default);

            this.commandHandler.register('fitnah', {
                description: 'Fitnah message',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/fitnah.js')).default);

            // Set Done/Proses commands
            this.commandHandler.register('setdone', {
                description: 'Set done message',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/setdone.js')).default);

            this.commandHandler.register('delsetdone', {
                description: 'Delete set done',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/delsetdone.js')).default);

            this.commandHandler.register('setproses', {
                description: 'Set proses message',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/setproses.js')).default);

            this.commandHandler.register('delsetproses', {
                description: 'Delete set proses',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/delsetproses.js')).default);

            // Additional general commands
            this.commandHandler.register('ceksewa', {
                description: 'Cek status sewa',
                category: 'general'
            }, (await import('./commands/general/ceksewa.js')).default);

            this.commandHandler.register('script', {
                description: 'Info script bot',
                category: 'general'
            }, (await import('./commands/general/script.js')).default);

            // More owner commands
            this.commandHandler.register('gantiqris', {
                description: 'Ganti QR payment',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/gantiqris.js')).default);

            this.commandHandler.register('addproduk', {
                description: 'Tambah produk',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/addproduk.js')).default);

            this.commandHandler.register('delproduk', {
                description: 'Hapus produk',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/delproduk.js')).default);

            this.commandHandler.register('logout', {
                description: 'Force logout and destroy session',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/logout.js')).default);

            this.commandHandler.register('queuestats', {
                description: 'Show queue statistics',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/queuestats.js')).default);

            this.commandHandler.register('afkstats', {
                description: 'Show AFK statistics across all groups',
                category: 'owner',
                ownerOnly: true
            }, (await import('./commands/owner/afkstats.js')).default);

            this.commandHandler.register('botstat', {
                description: 'Show comprehensive bot health statistics',
                category: 'owner',
                aliases: ['botstatus', 'health'],
                ownerOnly: true
            }, (await import('./commands/owner/botstat.js')).default);

            this.commandHandler.register('resetqueue', {
                description: 'Reset and clear all bot queues to restore responsiveness',
                category: 'owner',
                aliases: ['reset', 'clearqueue'],
                ownerOnly: true
            }, (await import('./commands/owner/resetqueue.js')).default);

            // More admin commands
            this.commandHandler.register('updatelist', {
                description: 'Update list item',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/updatelist.js')).default);

            this.commandHandler.register('changelist', {
                description: 'Change list item',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/changelist.js')).default);

            this.commandHandler.register('open', {
                description: 'Open group',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/open.js')).default);

            this.commandHandler.register('close', {
                description: 'Close group',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/close.js')).default);

            this.commandHandler.register('hapuslist', {
                description: 'Hapus list',
                category: 'admin',
                adminOnly: true,
                groupOnly: true
            }, (await import('./commands/admin/hapuslist.js')).default);

            logger.info(`Loaded ${this.commandHandler.getCommands().length} commands`);
        } catch (error) {
            logger.error('Error loading commands:', error);
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