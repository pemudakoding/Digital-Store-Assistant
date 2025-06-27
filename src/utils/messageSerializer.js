/**
 * Message Serializer
 * Enhances WhatsApp message objects with additional properties for easier handling
 */

class MessageSerializer {
    
    /**
     * Serialize WhatsApp message object
     * @param {Object} conn - WhatsApp connection
     * @param {Object} msg - Raw message object
     * @returns {Object} Enhanced message object
     */
    static serialize(conn, msg) {
        // Determine if message is from group
        msg.isGroup = msg.key.remoteJid.endsWith('@g.us');

        // Extract message type
        try {
            const messageKey = Object.keys(msg.message)[0];
            msg.type = messageKey;
        } catch {
            msg.type = null;
        }

        // Handle quoted messages
        try {
            const context = msg.message[msg.type].contextInfo.quotedMessage;
            
            if (context["ephemeralMessage"]) {
                msg.quotedMsg = context.ephemeralMessage.message;
            } else {
                msg.quotedMsg = context;
            }
            
            msg.isQuotedMsg = true;
            msg.quotedMsg.sender = msg.message[msg.type].contextInfo.participant;
            msg.quotedMsg.fromMe = msg.quotedMsg.sender === conn.user.id.split(':')[0] + '@s.whatsapp.net';
            msg.quotedMsg.type = Object.keys(msg.quotedMsg)[0];
            
            // Extract quoted message text
            const quotedMsg = msg.quotedMsg;
            msg.quotedMsg.chats = this.extractMessageText(quotedMsg);
            msg.quotedMsg.id = msg.message[msg.type].contextInfo.stanzaId;
            
        } catch {
            msg.quotedMsg = null;
            msg.isQuotedMsg = false;
        }

        // Handle mentioned users
        try {
            const mention = msg.message[msg.type].contextInfo.mentionedJid;
            msg.mentioned = mention || [];
        } catch {
            msg.mentioned = [];
        }

        // Set sender information
        if (msg.isGroup) {
            msg.sender = msg.participant;
        } else {
            msg.sender = msg.key.remoteJid;
        }

        if (msg.key.fromMe) {
            msg.sender = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        }

        // Set basic message properties
        msg.from = msg.key.remoteJid;
        msg.now = msg.messageTimestamp;
        msg.fromMe = msg.key.fromMe;

        // Extract message body/text
        msg.body = this.extractMessageText(msg.message);

        return msg;
    }

    /**
     * Extract text content from message object
     * @param {Object} message - Message object
     * @returns {string} Extracted text
     */
    static extractMessageText(message) {
        if (!message) return '';
        
        const messageType = Object.keys(message)[0];
        const messageContent = message[messageType];
        
        switch (messageType) {
            case 'conversation':
                return messageContent;
            
            case 'imageMessage':
            case 'videoMessage':
            case 'documentMessage':
                return messageContent.caption || '';
            
            case 'extendedTextMessage':
                return messageContent.text || '';
            
            case 'buttonsMessage':
                return messageContent.contentText || '';
            
            case 'templateMessage':
                return messageContent.hydratedTemplate?.hydratedContentText || '';
            
            case 'listMessage':
                return messageContent.description || '';
            
            default:
                return '';
        }
    }

    /**
     * Check if message has media
     * @param {Object} msg - Message object
     * @returns {boolean} Has media
     */
    static hasMedia(msg) {
        const mediaTypes = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'];
        return mediaTypes.includes(msg.type);
    }

    /**
     * Get message media type
     * @param {Object} msg - Message object
     * @returns {string|null} Media type
     */
    static getMediaType(msg) {
        if (!this.hasMedia(msg)) return null;
        
        return msg.type.replace('Message', '');
    }

    /**
     * Check if message is a reply
     * @param {Object} msg - Message object
     * @returns {boolean} Is reply
     */
    static isReply(msg) {
        return msg.isQuotedMsg;
    }

    /**
     * Check if message mentions someone
     * @param {Object} msg - Message object
     * @returns {boolean} Has mentions
     */
    static hasMentions(msg) {
        return msg.mentioned && msg.mentioned.length > 0;
    }

    /**
     * Get clean phone number from jid
     * @param {string} jid - WhatsApp JID
     * @returns {string} Clean phone number
     */
    static getPhoneNumber(jid) {
        return jid.split('@')[0];
    }
}

export default MessageSerializer; 