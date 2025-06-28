import logger from "../utils/logger.js";
import messages from "../config/messages.js";
import { messageQueue, mediaQueue, queueHelpers } from "../utils/queue.js";

class MessageService {
    constructor(client) {
        this.client = client;
    }

    /**
     * Send a text message using queue with enhanced error handling
     */
    async sendText(to, text, options = {}) {
        return queueHelpers.safeAdd(
            messageQueue,
            async () => {
                try {
                    // Validate inputs
                    if (!to || !text) {
                        throw new Error('Missing required parameters: to or text');
                    }
                    
                    return await this.client.sendMessage(to, { text }, options);
                } catch (error) {
                    logger.error(`Failed to send text message to ${to}`, error);
                    throw error;
                }
            },
            async () => {
                // Fallback: direct send without queue
                logger.warn('Fallback: Sending message without queue');
                return await this.sendTextDirect(to, text, options);
            }
        );
    }

    /**
     * Reply to a message using queue with enhanced error handling
     */
    async reply(from, content, quotedMsg) {
        return queueHelpers.safeAdd(
            messageQueue,
            async () => {
                return this.sendTextDirect(from, content, { quoted: quotedMsg });
            },
            async () => {
                // Fallback: send without quote if reply fails
                logger.warn('Fallback: Sending reply without quote');
                return this.sendTextDirect(from, content);
            }
        );
    }



    /**
     * Send text directly (internal use) with timeout protection
     */
    async sendTextDirect(to, text, options = {}) {
        try {
            // Add timeout protection
            return await Promise.race([
                this.client.sendMessage(to, { text }, options),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Send message timeout')), 10000)
                )
            ]);
        } catch (error) {
            logger.error(`Failed to send text message to ${to}`, error);
            
            // Try simplified send if original fails
            if (options.quoted) {
                logger.warn('Retrying without quoted message');
                try {
                    return await this.client.sendMessage(to, { text });
                } catch (retryError) {
                    logger.error('Retry also failed:', retryError);
                }
            }
            
            throw error;
        }
    }

    /**
     * Send image with caption using media queue with enhanced error handling
     */
    async sendImage(to, buffer, caption = "", options = {}) {
        return queueHelpers.safeAdd(
            mediaQueue,
            async () => {
                try {
                    // Validate buffer
                    if (!buffer || !Buffer.isBuffer(buffer)) {
                        throw new Error('Invalid image buffer');
                    }
                    
                    return await Promise.race([
                        this.client.sendMessage(to, {
                            image: buffer,
                            caption
                        }, options),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Send image timeout')), 15000)
                        )
                    ]);
                } catch (error) {
                    logger.error(`Failed to send image to ${to}`, error);
                    throw error;
                }
            },
            async () => {
                // Fallback: send caption as text if image fails
                if (caption) {
                    logger.warn('Fallback: Sending caption as text instead of image');
                    return await this.sendText(to, `🖼️ ${caption}\n\n_Gambar gagal dikirim_`);
                }
                throw new Error('Image send failed and no caption available');
            }
        );
    }

    /**
     * Send contact card using queue with enhanced validation
     */
    async sendContact(to, numbers, name, quoted = null) {
        return queueHelpers.safeAdd(
            messageQueue,
            async () => {
                try {
                    // Validate inputs
                    if (!Array.isArray(numbers) || numbers.length === 0) {
                        throw new Error('Invalid phone numbers array');
                    }
                    
                    if (!name || typeof name !== 'string') {
                        throw new Error('Invalid contact name');
                    }
                    
                    const contacts = numbers.map(num => ({
                        displayName: name,
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nitem1.TEL;waid=${num}:${num}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                    }));

                    return await Promise.race([
                        this.client.sendMessage(to, {
                            contacts: {
                                displayName: name,
                                contacts
                            }
                        }, { quoted }),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Send contact timeout')), 10000)
                        )
                    ]);
                } catch (error) {
                    logger.error(`Failed to send contact to ${to}`, error);
                    throw error;
                }
            },
            async () => {
                // Fallback: send contact info as text
                const contactText = `📞 *Kontak: ${name}*\n${numbers.map(num => `• ${num}`).join('\n')}`;
                return await this.sendText(to, contactText);
            }
        );
    }

    /**
     * Send message with mentions using queue
     */
    async sendMentions(to, text, mentions = [], options = {}) {
        return queueHelpers.safeAdd(
            messageQueue,
            async () => {
                try {
                    return await Promise.race([
                        this.client.sendMessage(to, {
                            text,
                            mentions
                        }, options),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Send mentions timeout')), 10000)
                        )
                    ]);
                } catch (error) {
                    logger.error(`Failed to send mentions to ${to}`, error);
                    throw error;
                }
            },
            async () => {
                // Fallback: send as regular text without mentions
                logger.warn('Fallback: Sending as regular text without mentions');
                return await this.sendText(to, text);
            }
        );
    }

    /**
     * Send welcome message using queue
     */
    async sendWelcome(groupId, newMember, groupName) {
        return messageQueue.add(async () => {
            const welcomeText = messages.welcome.join(
                newMember.split("@")[0], 
                groupName
            );
            
            return this.sendMentionsDirect(groupId, welcomeText, [newMember], {
                footer: groupName
            });
        });
    }

    /**
     * Send goodbye message using queue
     */
    async sendGoodbye(groupId, leftMember, groupName) {
        return messageQueue.add(async () => {
            const goodbyeText = messages.welcome.leave(
                leftMember.split("@")[0], 
                groupName
            );
            
            return this.sendMentionsDirect(groupId, goodbyeText, [leftMember], {
                footer: groupName
            });
        });
    }

    /**
     * Send promotion message using queue
     */
    async sendPromotion(groupId, promotedMember, groupName) {
        return messageQueue.add(async () => {
            const promoteText = messages.welcome.promote(
                promotedMember.split("@")[0], 
                groupName
            );
            
            return this.sendMentionsDirect(groupId, promoteText, [promotedMember], {
                footer: groupName
            });
        });
    }

    /**
     * Send demotion message using queue
     */
    async sendDemotion(groupId, demotedMember, groupName) {
        return messageQueue.add(async () => {
            const demoteText = messages.welcome.demote(
                demotedMember.split("@")[0], 
                groupName
            );
            
            return this.sendMentionsDirect(groupId, demoteText, [demotedMember], {
                footer: groupName
            });
        });
    }

    /**
     * Send mentions directly (internal use)
     */
    async sendMentionsDirect(to, text, mentions = [], options = {}) {
        try {
            return await this.client.sendMessage(to, {
                text,
                mentions
            }, options);
        } catch (error) {
            logger.error(`Failed to send mentions to ${to}`, error);
            throw error;
        }
    }

    /**
     * Send error message using queue with better error categorization
     */
    async sendError(to, errorType = 'general', quotedMsg = null) {
        return queueHelpers.safeAdd(
            messageQueue,
            async () => {
                const errorMessage = messages.errors?.[errorType] || messages.errors?.general || 
                                   "❌ Terjadi kesalahan. Silakan coba lagi.";
                return this.sendTextDirect(to, errorMessage, { quoted: quotedMsg });
            },
            async () => {
                // Fallback: simple error message
                return this.sendTextDirect(to, "❌ Terjadi kesalahan sistem.");
            }
        );
    }

    /**
     * Send restriction message using queue
     */
    async sendRestriction(to, restrictionType, quotedMsg = null) {
        return messageQueue.add(async () => {
            const restrictionMessage = messages.restrictions[restrictionType];
            if (restrictionMessage) {
                return this.sendTextDirect(to, restrictionMessage, { quoted: quotedMsg });
            }
        });
    }

    /**
     * Send wait message with timeout protection
     */
    async sendWait(to, quotedMsg = null) {
        return queueHelpers.safeAdd(
            messageQueue,
            async () => {
                const waitMessage = messages.wait || "⏳ Tunggu sebentar...";
                return this.sendTextDirect(to, waitMessage, { quoted: quotedMsg });
            },
            async () => {
                // Fallback: simple wait message
                return this.sendTextDirect(to, "⏳ Proses...");
            }
        );
    }

    /**
     * Send media with queue (generic)
     */
    async sendMedia(to, mediaBuffer, mediaType, options = {}) {
        return mediaQueue.add(async () => {
            try {
                const mediaObject = {};
                mediaObject[mediaType] = mediaBuffer;
                
                return await this.client.sendMessage(to, mediaObject, options);
            } catch (error) {
                logger.error(`Failed to send ${mediaType} to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Send video using media queue
     */
    async sendVideo(to, buffer, caption = "", options = {}) {
        return mediaQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, {
                    video: buffer,
                    caption
                }, options);
            } catch (error) {
                logger.error(`Failed to send video to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Send audio using media queue
     */
    async sendAudio(to, buffer, options = {}) {
        return mediaQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, {
                    audio: buffer,
                    mimetype: 'audio/mp4'
                }, options);
            } catch (error) {
                logger.error(`Failed to send audio to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Send sticker using media queue
     */
    async sendSticker(to, buffer, options = {}) {
        return mediaQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, {
                    sticker: buffer
                }, options);
            } catch (error) {
                logger.error(`Failed to send sticker to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Send document using media queue
     */
    async sendDocument(to, buffer, filename, mimetype, options = {}) {
        return mediaQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, {
                    document: buffer,
                    fileName: filename,
                    mimetype: mimetype
                }, options);
            } catch (error) {
                logger.error(`Failed to send document to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Health check for message service
     */
    async healthCheck() {
        try {
            // Try to get bot info to check connection
            const botInfo = await this.client.user;
            return {
                status: 'healthy',
                botId: botInfo?.id,
                timestamp: new Date()
            };
        } catch (error) {
            logger.error('MessageService health check failed:', error);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date()
            };
        }
    }


}

export default MessageService; 