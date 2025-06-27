import logger from "../utils/logger.js";
import messages from "../config/messages.js";
import { messageQueue, mediaQueue } from "../utils/queue.js";

class MessageService {
    constructor(client) {
        this.client = client;
    }

    /**
     * Send a text message using queue
     */
    async sendText(to, text, options = {}) {
        return messageQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, { text }, options);
            } catch (error) {
                logger.error(`Failed to send text message to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Reply to a message using queue
     */
    async reply(from, content, quotedMsg) {
        return messageQueue.add(async () => {
            return this.sendTextDirect(from, content, { quoted: quotedMsg });
        });
    }

    /**
     * Send text directly (internal use)
     */
    async sendTextDirect(to, text, options = {}) {
        try {
            return await this.client.sendMessage(to, { text }, options);
        } catch (error) {
            logger.error(`Failed to send text message to ${to}`, error);
            throw error;
        }
    }

    /**
     * Send image with caption using media queue
     */
    async sendImage(to, buffer, caption = "", options = {}) {
        return mediaQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, {
                    image: buffer,
                    caption
                }, options);
            } catch (error) {
                logger.error(`Failed to send image to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Send contact card using queue
     */
    async sendContact(to, numbers, name, quoted = null) {
        return messageQueue.add(async () => {
            try {
                const contacts = numbers.map(num => ({
                    displayName: name,
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${name}\nFN:${name}\nitem1.TEL;waid=${num}:${num}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
                }));

                return await this.client.sendMessage(to, {
                    contacts: {
                        displayName: name,
                        contacts
                    }
                }, { quoted });
            } catch (error) {
                logger.error(`Failed to send contact to ${to}`, error);
                throw error;
            }
        });
    }

    /**
     * Send message with mentions using queue
     */
    async sendMentions(to, text, mentions = [], options = {}) {
        return messageQueue.add(async () => {
            try {
                return await this.client.sendMessage(to, {
                    text,
                    mentions
                }, options);
            } catch (error) {
                logger.error(`Failed to send mentions to ${to}`, error);
                throw error;
            }
        });
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
     * Send error message using queue
     */
    async sendError(to, errorType = 'general', quotedMsg = null) {
        return messageQueue.add(async () => {
            const errorMessage = messages.errors[errorType] || messages.errors.general;
            return this.sendTextDirect(to, errorMessage, { quoted: quotedMsg });
        });
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
     * Send wait message using queue
     */
    async sendWait(to, quotedMsg = null) {
        return messageQueue.add(async () => {
            return this.sendTextDirect(to, messages.wait, { quoted: quotedMsg });
        });
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
}

export default MessageService; 