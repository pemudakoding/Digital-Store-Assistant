/**
 * Serialize Baileys message
 */
function serialize(client, msg) {
    try {
        // Basic message info
        msg.isGroup = msg.key.remoteJid.endsWith('@g.us');
        
        // Message type
        try {
            const messageType = Object.keys(msg.message)[0];
            msg.type = messageType;
        } catch {
            msg.type = null;
        }

        // Quoted message
        try {
            const context = msg.message[msg.type]?.contextInfo?.quotedMessage;
            if (context) {
                if (context["ephemeralMessage"]) {
                    msg.quotedMsg = context.ephemeralMessage.message;
                } else {
                    msg.quotedMsg = context;
                }
                
                msg.isQuotedMsg = true;
                msg.quotedMsg.sender = msg.message[msg.type].contextInfo.participant;
                msg.quotedMsg.fromMe = msg.quotedMsg.sender === client.user.id.split(':')[0] + '@s.whatsapp.net';
                msg.quotedMsg.type = Object.keys(msg.quotedMsg)[0];
                
                // Extract quoted message text
                const quotedMessage = msg.quotedMsg;
                msg.quotedMsg.chats = extractMessageText(quotedMessage);
                msg.quotedMsg.id = msg.message[msg.type].contextInfo.stanzaId;
            } else {
                msg.quotedMsg = null;
                msg.isQuotedMsg = false;
            }
        } catch {
            msg.quotedMsg = null;
            msg.isQuotedMsg = false;
        }

        // Mentioned users
        try {
            const mention = msg.message[msg.type]?.contextInfo?.mentionedJid;
            msg.mentioned = mention || [];
        } catch {
            msg.mentioned = [];
        }

        // Sender info
        if (msg.isGroup) {
            msg.sender = msg.participant || msg.key.participant;
        } else {
            msg.sender = msg.key.remoteJid;
        }

        if (msg.key.fromMe) {
            msg.sender = client.user.id.split(':')[0] + '@s.whatsapp.net';
        }

        // Additional properties
        msg.from = msg.key.remoteJid;
        msg.now = msg.messageTimestamp;
        msg.fromMe = msg.key.fromMe;

        return msg;
    } catch (error) {
        console.error('Error serializing message:', error);
        return null;
    }
}

/**
 * Extract text from message
 */
function extractMessageText(message) {
    const msg = message.message || message;
    const type = Object.keys(msg)[0];
    
    switch (type) {
        case 'conversation':
            return msg.conversation;
        case 'imageMessage':
            return msg.imageMessage.caption || '';
        case 'videoMessage':
            return msg.videoMessage.caption || '';
        case 'documentMessage':
            return msg.documentMessage.caption || '';
        case 'extendedTextMessage':
            return msg.extendedTextMessage.text || '';
        case 'buttonsMessage':
            return msg.buttonsMessage.contentText || '';
        default:
            return '';
    }
}

export {
    serialize,
    extractMessageText
};

export default {
    serialize,
    extractMessageText
}; 