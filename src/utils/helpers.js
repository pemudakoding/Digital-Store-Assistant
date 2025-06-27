import moment from "moment-timezone";

/**
 * Parse mentions from text
 */
function parseMention(text = "") {
    return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
}

/**
 * Get current time formatted
 */
function getCurrentTime() {
    return moment.tz("Asia/Jakarta").format("HH:mm:ss");
}

/**
 * Get current date formatted
 */
function getCurrentDate() {
    return moment().tz("Asia/Jakarta").format("ll");
}

/**
 * Get current day
 */
function getCurrentDay() {
    return moment().tz("Asia/Jakarta").format("dddd");
}

/**
 * Get greeting based on time
 */
function getGreeting() {
    const dt = moment(Date.now()).tz("Asia/Jakarta").locale("id").format("a");
    return "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1);
}

/**
 * Convert milliseconds to date
 */
function msToDate(ms) {
    const date = new Date(ms);
    const years = date.getFullYear();
    const months = String(date.getMonth() + 1).padStart(2, '0');
    const days = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${years}-${months}-${days} ${hours}:${minutes}:${seconds}`;
}

/**
 * Convert time string to milliseconds
 */
function timeToMs(time) {
    const units = {
        's': 1000,
        'm': 60 * 1000,
        'h': 60 * 60 * 1000,
        'd': 24 * 60 * 60 * 1000,
        'w': 7 * 24 * 60 * 60 * 1000
    };

    const match = time.match(/^(\d+)([smhdw])$/);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2];

    return value * units[unit];
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate random string
 */
function generateRandomString(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Validate URL
 */
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * Clean phone number
 */
function cleanPhoneNumber(phone) {
    return phone.replace(/[^\d]/g, '').replace(/^0/, '62');
}

/**
 * Format phone number for WhatsApp
 */
function formatWhatsAppNumber(phone) {
    const cleaned = cleanPhoneNumber(phone);
    return cleaned + '@s.whatsapp.net';
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Sleep function
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Chunk array into smaller arrays
 */
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

export {
    parseMention,
    getCurrentTime,
    getCurrentDate,
    getCurrentDay,
    getGreeting,
    msToDate,
    timeToMs,
    formatFileSize,
    generateRandomString,
    isValidUrl,
    cleanPhoneNumber,
    formatWhatsAppNumber,
    escapeRegex,
    sleep,
    chunkArray
};

export default {
    parseMention,
    getCurrentTime,
    getCurrentDate,
    getCurrentDay,
    getGreeting,
    msToDate,
    timeToMs,
    formatFileSize,
    generateRandomString,
    isValidUrl,
    cleanPhoneNumber,
    formatWhatsAppNumber,
    escapeRegex,
    sleep,
    chunkArray
}; 