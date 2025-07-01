import logger from "../utils/logger.js";
import { getCurrentTime, getCurrentDate, getCurrentDay, getGreeting } from "../utils/common.js";
import { messageQueue, chatUpsertQueue, queueHelpers } from "../utils/queue.js";

class MessageHandler {
    constructor(client, services, commandHandler) {
        this.client = client;
        this.services = services;
        this.commandHandler = commandHandler;
    }

    /**
     * Handle incoming messages using queue with enhanced error handling
     */
    async handleMessage(m) {
        return queueHelpers.safeAdd(
            chatUpsertQueue,
            async () => this.processMessage(m),
            async () => {
                logger.warn('Fallback: Processing message without queue');
                return this.processMessage(m);
            },
            'handleMessage'
        );
    }

    /**
     * Process incoming message with enhanced error handling and fallback responses
     */
    async processMessage(m) {
        try {
            const msg = m.messages[0];
            if (!msg || !msg.message) return;

            // Create message context
            const context = await this.createContext(msg);
            
            // Process messages from bot if they are sent by us
            if (msg.key.fromMe) {
                logger.debug(`Ignoring self-message from bot: ${context.sender}`);

                return;
            }
            
            // Log message
            this.logMessage(context);

            // Check AFK auto-return (when AFK user sends a message)
            await this.handleAfkAutoReturn(context);

            // Check if body contains a command
            const parsed = this.commandHandler.parseCommandWithoutPrefix(context.body);
            if (parsed) {
                // Execute command using queue with enhanced error handling
                await queueHelpers.safeAdd(
                    messageQueue,
                    async () => {
                        return this.commandHandler.execute(parsed.command, {
                            ...context,
                            args: parsed.args,
                            fullArgs: parsed.fullArgs,
                            commandHandler: this.commandHandler
                        });
                    },
                    async () => {
                        // Fallback: direct execution without queue
                        logger.warn('Fallback: Executing command without queue');
                        return this.commandHandler.execute(parsed.command, {
                            ...context,
                            args: parsed.args,
                            fullArgs: parsed.fullArgs,
                            commandHandler: this.commandHandler
                        });
                    },
                    `command:${parsed.command}`
                );
                return; // Exit after command execution
            }

            // Check AFK mentions (when someone mentions/replies to AFK users)
            await this.handleAfkMentions(context);

            // Check if message body matches a product key from list
            await this.handleProductKeyCheck(context);

        } catch (error) {
            logger.error("Error handling message", error);
            
            // Send error response to user if possible
            try {
                if (context?.messageService && context?.from && context?.msg) {
                    await context.messageService.reply(
                        context.from, 
                        "⚠️ Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.", 
                        context.msg
                    );
                }
            } catch (responseError) {
                logger.error("Failed to send error response", responseError);
            }
        }
    }

    /**
     * Handle AFK auto-return when AFK user sends a message
     */
    async handleAfkAutoReturn(context) {
        try {
            const { sender, afkManager, messageService, from, msg, pushname, isGroup } = context;
            
            if (!isGroup) return; // Only work in groups
            
            // Check if sender is currently AFK in this group
            const afkUser = afkManager.getAfkUser(sender, from);
            if (!afkUser) return;

            // Remove user from AFK in this group
            afkManager.removeAfk(sender, from);
            
            // Get AFK duration
            const duration = this.calculateAfkDuration(afkUser.timeStamp);
            
            // Create return message
            const returnMessage = this.createAfkReturnMessage(pushname, afkUser.reason, duration);
            
            // Send return message
            await messageService.reply(from, returnMessage, msg);
            
            logger.info(`AFK Return: ${pushname} (${sender}) returned from AFK in group`);
            
        } catch (error) {
            logger.error("Error handling AFK auto return:", error);
        }
    }

    /**
     * Handle AFK mentions when someone mentions or replies to AFK users
     */
    async handleAfkMentions(context) {
        try {
            const { msg, from, messageService, afkManager, isGroup, quotedMsg, isQuotedMsg } = context;
            
            if (!isGroup) return; // Only work in groups
            
            let mentionedUsers = [];
            
            // Extract mentions from message
            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            mentionedUsers.push(...mentions);
            
            // Check if replying to someone
            if (isQuotedMsg && quotedMsg?.sender) {
                mentionedUsers.push(quotedMsg.sender);
            }
            
            // Remove duplicates
            mentionedUsers = [...new Set(mentionedUsers)];
            
            if (mentionedUsers.length === 0) return;
            
            // Check which mentioned users are AFK in this group
            const afkUsers = afkManager.getAfkUsers(mentionedUsers, from);
            
            if (afkUsers.length === 0) return;
            
            // Create and send AFK notification message
            const afkMessage = this.createAfkNotificationMessage(afkUsers);
            await messageService.reply(from, afkMessage, msg);
            
            logger.info(`AFK Notification: Notified about ${afkUsers.length} AFK user(s) in group`);
            
        } catch (error) {
            logger.error("Error handling AFK mentions:", error);
        }
    }

    /**
     * Create AFK notification message for mentioned AFK users
     */
    createAfkNotificationMessage(afkUsers) {
        if (afkUsers.length === 1) {
            const user = afkUsers[0];
            const duration = this.calculateAfkDuration(user.timeStamp);
            
            const messages = [
                `🌙 *${user.pushname}* sedang AFK nih...\n💭 *Alasan:* ${user.reason}\n⏰ *Sudah pergi:* ${duration}`,
                `😴 *${user.pushname}* lagi tidak ada di tempat\n💬 *Alasan:* ${user.reason}\n🕐 *Sejak:* ${duration} yang lalu`,
                `🚶‍♂️ *${user.pushname}* sedang menghilang...\n📝 *Alasan:* ${user.reason}\n⌚ *Durasi:* ${duration}`,
                `🎭 *${user.pushname}* sedang dalam mode ninja\n🎯 *Alasan:* ${user.reason}\n⏳ *Lama pergi:* ${duration}`,
                `🌸 *${user.pushname}* sedang berkelana...\n🗯️ *Alasan:* ${user.reason}\n📅 *Sudah berlalu:* ${duration}`
            ];
            
            return messages[Math.floor(Math.random() * messages.length)];
        } else {
            let message = `🌙 *Beberapa admin sedang AFK:*\n\n`;
            
            afkUsers.forEach((user, index) => {
                const duration = this.calculateAfkDuration(user.timeStamp);
                message += `${index + 1}. *${user.pushname}*\n`;
                message += `   💭 ${user.reason}\n`;
                message += `   ⏰ ${duration}\n\n`;
            });
            
            message += `_Mohon tunggu hingga mereka kembali ya! 🙏_`;
            
            return message;
        }
    }

    /**
     * Create AFK return message
     */
    createAfkReturnMessage(pushname, reason, duration) {
        const messages = [
            `🎉 *${pushname}* udah balik nih!\n💫 *Tadi AFK:* ${reason}\n⏰ *Lama pergi:* ${duration}\n\n_Welcome back, admin! 👋_`,
            `✨ *${pushname}* telah kembali dari petualangan!\n🗯️ *Alasan tadi:* ${reason}\n🕐 *Durasi:* ${duration}\n\n_Selamat datang kembali! 🤗_`,
            `🌟 *${pushname}* sudah online lagi!\n📝 *Kemarin AFK:* ${reason}\n⌚ *Selama:* ${duration}\n\n_Admin kesayangan sudah kembali! 💪_`,
            `🎊 *${pushname}* has returned!\n💭 *Reason before:* ${reason}\n⏳ *Duration:* ${duration}\n\n_Back in action! 🔥_`,
            `🦋 *${pushname}* sudah selesai ${reason.toLowerCase()}!\n⏰ *Waktu pergi:* ${duration}\n\n_Mari lanjutkan aktivitas! 🚀_`
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }

    /**
     * Calculate AFK duration in human readable format
     */
    calculateAfkDuration(timestamp) {
        const now = Date.now();
        const duration = now - timestamp;
        
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            const remainingHours = hours % 24;
            if (remainingHours > 0) {
                return `${days} hari ${remainingHours} jam`;
            }
            return `${days} hari`;
        } else if (hours > 0) {
            const remainingMinutes = minutes % 60;
            if (remainingMinutes > 0) {
                return `${hours} jam ${remainingMinutes} menit`;
            }
            return `${hours} jam`;
        } else if (minutes > 0) {
            return `${minutes} menit`;
        } else {
            return `${seconds} detik`;
        }
    }

    /**
     * Create message context
     */
    async createContext(msg) {
        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? (msg.key.participant || msg.participant) : from;
        const pushname = msg.pushName || 'User';

        // Extract message content
        const content = this.extractMessageContent(msg);
        const body = content.trim();

        // Check for quoted message
        const isQuotedMsg = !!(msg.message?.extendedTextMessage?.contextInfo?.quotedMessage);
        let quotedMsg = null;
        
        if (isQuotedMsg) {
            const quotedContext = msg.message.extendedTextMessage.contextInfo;
            quotedMsg = {
                key: {
                    remoteJid: from,
                    fromMe: false,
                    id: quotedContext.stanzaId,
                    participant: quotedContext.participant || quotedContext.remoteJid
                },
                message: quotedContext.quotedMessage,
                messageTimestamp: quotedContext.quotedMessage?.messageTimestamp || Date.now(),
                pushName: quotedContext.pushName || 'User',
                sender: quotedContext.participant || quotedContext.remoteJid,
                content: this.extractQuotedMessageContent(quotedContext.quotedMessage),
                stanzaId: quotedContext.stanzaId
            };
        }

        // Group metadata
        let groupMetadata = null;
        let groupName = '';
        let groupMembers = [];
        let isGroupAdmin = false;
        let isBotGroupAdmin = false;

        if (isGroup) {
            groupMetadata = await this.services.groupService.getGroupMetadata(from);
            groupName = groupMetadata?.subject || '';
            groupMembers = groupMetadata?.participants || [];
            isGroupAdmin = await this.services.groupService.isGroupAdmin(from, sender);
            isBotGroupAdmin = await this.services.groupService.isBotGroupAdmin(from);
        }

        // Check owner
        const isOwner = [global.ownerNumber].includes(sender);

        return {
            msg,
            from,
            sender,
            pushname,
            body,
            isGroup,
            groupMetadata,
            groupName,
            groupMembers,
            isGroupAdmin,
            isBotGroupAdmin,
            isOwner,
            isQuotedMsg,
            quotedMsg,
            time: getCurrentTime(),
            date: getCurrentDate(),
            day: getCurrentDay(),
            greeting: getGreeting(),
            messageService: this.services.messageService,
            groupService: this.services.groupService,
            listManager: this.services.listManager,
            afkManager: this.services.afkManager,
            testiManager: this.services.testiManager,
            sewaManager: this.services.sewaManager,
            welcomeManager: this.services.welcomeManager,
            antilinkManager: this.services.antilinkManager,
            produkManager: this.services.produkManager,
            templateManager: this.services.templateManager,
            client: this.client,
            
            // Add reply method using queue
            reply: async (text, options = {}) => {
                return messageQueue.add(async () => {
                    return await this.client.sendMessage(from, { text }, { quoted: msg, ...options });
                });
            }
        };
    }

    /**
     * Extract message content from different message types
     */
    extractMessageContent(msg) {
        return msg.message?.conversation
            || msg.message?.imageMessage?.caption
            || msg.message?.videoMessage?.caption
            || msg.message?.extendedTextMessage?.text
            || msg.message?.buttonsResponseMessage?.selectedButtonId
            || msg.message?.templateButtonReplyMessage?.selectedId
            || msg.message?.listResponseMessage?.singleSelectReply?.selectedRowId
            || msg.message?.ephemeralMessage?.message?.extendedTextMessage?.text
            || msg.message?.messageContextInfo?.text
            || '';
    }

    /**
     * Extract content from quoted message
     */
    extractQuotedMessageContent(quotedMessage) {
        return quotedMessage?.conversation
            || quotedMessage?.imageMessage?.caption
            || quotedMessage?.videoMessage?.caption
            || quotedMessage?.extendedTextMessage?.text
            || quotedMessage?.buttonsResponseMessage?.selectedButtonId
            || quotedMessage?.templateButtonReplyMessage?.selectedId
            || quotedMessage?.listResponseMessage?.singleSelectReply?.selectedRowId
            || '';
    }

    /**
     * Log incoming message
     */
    logMessage(context) {
        const { isGroup, sender, pushname, body, groupName, from } = context;
        
        if (isGroup) {
            logger.info(`Group: ${groupName} | ${pushname} (${sender}): ${body}`);
        } else {
            logger.info(`Private: ${pushname} (${sender}): ${body}`);
        }
    }

    /**
     * Check if message body matches a product key and handle accordingly
     */
    async handleProductKeyCheck(context) {
        return messageQueue.add(async () => {
            try {
                const { body, from, msg, listManager, messageService, isGroup } = context;
                
                // Only check for product keys in groups
                if (!isGroup) return;
                
                // Get list data for this group
                const allListData = listManager.getListDb();
                const groupListData = allListData.filter(item => item.id === from);
                
                if (groupListData.length === 0) return;
                
                // Check if body matches any product key (case insensitive)
                const matchedProduct = groupListData.find(item => 
                    item.key.toLowerCase() === body.trim().toLowerCase()
                );
                
                if (matchedProduct) {
                    if (matchedProduct.isClose) {
                        // Product is closed
                        const closedMessage = `🚫 *Produk Tutup Sementara* 🚫\n\n` +
                            `Maaf, produk *${matchedProduct.key}* sedang tutup untuk sementara waktu.\n\n` +
                            `🔄 *Status:* Tidak tersedia\n` +
                            `⏰ *Info:* Silakan coba lagi nanti\n` +
                            `💡 *Tip:* Cek list produk lain yang masih tersedia!\n\n` +
                            `_Ketik *list* untuk melihat produk yang tersedia_`;
                        
                        await messageService.reply(from, closedMessage, msg);
                    } else {
                        // Product is open, show the response
                        let productResponse = matchedProduct.response;
                        
                        // If product has image, handle it
                        if (matchedProduct.isImage && matchedProduct.image_url) {
                            await this.client.sendMessage(from, {
                                image: { url: matchedProduct.image_url },
                                caption: productResponse
                            }, { quoted: msg });
                        } else {
                            await messageService.reply(from, productResponse, msg);
                        }
                    }
                }
            } catch (error) {
                logger.error("Error checking product key", error);
            }
        });
    }
}

export default MessageHandler; 