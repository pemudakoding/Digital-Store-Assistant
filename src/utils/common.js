/**
 * Common Utility Functions
 * Collection of frequently used helper functions
 */

import axios from "axios";
import fs from "fs";
import jimp from "jimp";

// Lazy import for node-fetch (for environments where it's not available)
let fetch;

/**
 * Initialize fetch if not already available
 */
async function initFetch() {
    if (!fetch) {
        const nodeFetch = await import('node-fetch');
        fetch = nodeFetch.default;
    }
    return fetch;
}

/**
 * Generate random string with extension
 * @param {string} ext - File extension
 * @returns {string} Random filename
 */
function getRandom(ext) {
    return `${Math.floor(Math.random() * 10000)}${ext}`;
}

/**
 * Generate random alphanumeric string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Check if string is valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} Is valid URL
 */
function isUrl(url) {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i');
    return !!pattern.test(url);
}

/**
 * Get buffer from URL or local path
 * @param {string} path - URL or file path
 * @param {object} options - Request options
 * @returns {Promise<Buffer>} File buffer
 */
async function getBuffer(path, options = {}) {
    try {
        if (path.startsWith('http')) {
            const fetchFn = await initFetch();
            const response = await fetchFn(path, options);
            return await response.buffer();
        } else {
            return fs.readFileSync(path);
        }
    } catch (err) {
        throw err;
    }
}

/**
 * Fetch JSON from URL
 * @param {string} url - URL to fetch
 * @param {object} options - Fetch options
 * @returns {Promise<object>} JSON response
 */
async function fetchJson(url, options = {}) {
    try {
        const fetchFn = await initFetch();
        const response = await fetchFn(url, options);
        return await response.json();
    } catch (err) {
        throw err;
    }
}

/**
 * Get group admins from participants
 * @param {Array} participants - Group participants
 * @returns {Array} Admin user IDs
 */
function getGroupAdmins(participants) {
    let admins = [];
    for (let i of participants) {
        i.admin !== null ? admins.push(i.id) : '';
    }
    return admins;
}

/**
 * Format runtime duration
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

/**
 * Sleep/delay execution
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Sleep promise
 */
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Resize image buffer
 * @param {Buffer} buffer - Image buffer
 * @param {number} width - Target width
 * @param {number} height - Target height
 * @returns {Promise<Buffer>} Resized image buffer
 */
async function reSize(buffer, width, height) {
    return new Promise(async(resolve, reject) => {
        try {
            const image = await jimp.read(buffer);
            const resized = await image.resize(width, height).getBufferAsync(jimp.MIME_JPEG);
            resolve(resized);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Pick random item from array
 * @param {Array} arr - Array to pick from
 * @returns {*} Random array item
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate random number in range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value (optional)
 * @returns {number} Random number
 */
function randomNumber(min, max = null) {
    if (max !== null) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        return Math.floor(Math.random() * min) + 1;
    }
}

/**
 * Check if set done exists for group
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 * @returns {boolean} Does exist
 */
function isSetDone(groupID, _db) {
    return _db.some(item => item.id === groupID);
}

/**
 * Change set done text
 * @param {string} teks - New text
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 */
function changeSetDone(teks, groupID, _db) {
    const index = _db.findIndex(item => item.id === groupID);
    if (index !== -1) {
        _db[index].text = teks;
        fs.writeFileSync("./database/set_done.json", JSON.stringify(_db, null, 3));
    }
}

/**
 * Add set done text
 * @param {string} teks - Text to add
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 */
function addSetDone(teks, groupID, _db) {
    const obj_add = {
        id: groupID,
        text: teks,
    };
    _db.push(obj_add);
    fs.writeFileSync("./database/set_done.json", JSON.stringify(_db, null, 3));
}

/**
 * Remove set done for group
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 */
function delSetDone(groupID, _db) {
    const index = _db.findIndex(item => item.id === groupID);
    if (index !== -1) {
        _db.splice(index, 1);
        fs.writeFileSync("./database/set_done.json", JSON.stringify(_db, null, 3));
    }
}

/**
 * Get set done text for group
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 * @returns {string|undefined} Set done text
 */
function getTextSetDone(groupID, _db) {
    const item = _db.find(item => item.id === groupID);
    return item ? item.text : undefined;
}

/**
 * Check if set proses exists for group
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 * @returns {boolean} Does exist
 */
function isSetProses(groupID, _db) {
    return _db.some(item => item.id === groupID);
}

/**
 * Change set proses text
 * @param {string} teks - New text
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 */
function changeSetProses(teks, groupID, _db) {
    const index = _db.findIndex(item => item.id === groupID);
    if (index !== -1) {
        _db[index].text = teks;
        fs.writeFileSync("./database/set_proses.json", JSON.stringify(_db, null, 3));
    }
}

/**
 * Add set proses text
 * @param {string} teks - Text to add
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 */
function addSetProses(teks, groupID, _db) {
    const obj_add = {
        id: groupID,
        text: teks,
    };
    _db.push(obj_add);
    fs.writeFileSync("./database/set_proses.json", JSON.stringify(_db, null, 3));
}

/**
 * Remove set proses for group
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 */
function delSetProses(groupID, _db) {
    const index = _db.findIndex(item => item.id === groupID);
    if (index !== -1) {
        _db.splice(index, 1);
        fs.writeFileSync("./database/set_proses.json", JSON.stringify(_db, null, 3));
    }
}

/**
 * Get set proses text for group
 * @param {string} groupID - Group ID
 * @param {Array} _db - Database array
 * @returns {string|undefined} Set proses text
 */
function getTextSetProses(groupID, _db) {
    const item = _db.find(item => item.id === groupID);
    return item ? item.text : undefined;
}

/**
 * Get current time in HH:MM:SS format
 * @returns {string} Current time
 */
function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * Get current date in DD/MM/YYYY format
 * @returns {string} Current date
 */
function getCurrentDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Get current day name in Indonesian
 * @returns {string} Current day name
 */
function getCurrentDay() {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const now = new Date();
    return days[now.getDay()];
}

/**
 * Get greeting based on current time
 * @returns {string} Greeting message
 */
function getGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 4 && hour < 10) {
        return 'Selamat Pagi';
    } else if (hour >= 10 && hour < 15) {
        return 'Selamat Siang';
    } else if (hour >= 15 && hour < 18) {
        return 'Selamat Sore';
    } else {
        return 'Selamat Malam';
    }
}

export {
    getRandom,
    makeId,
    isUrl,
    getBuffer,
    fetchJson,
    getGroupAdmins,
    runtime,
    sleep,
    reSize,
    pickRandom,
    randomNumber,
    // Date/Time functions
    getCurrentTime,
    getCurrentDate,
    getCurrentDay,
    getGreeting,
    // Set Done Management
    isSetDone,
    changeSetDone,
    addSetDone,
    delSetDone,
    getTextSetDone,
    // Set Proses Management
    isSetProses,
    changeSetProses,
    addSetProses,
    delSetProses,
    getTextSetProses
};

export default {
    getRandom,
    makeId,
    isUrl,
    getBuffer,
    fetchJson,
    getGroupAdmins,
    runtime,
    sleep,
    reSize,
    pickRandom,
    randomNumber,
    // Date/Time functions
    getCurrentTime,
    getCurrentDate,
    getCurrentDay,
    getGreeting,
    // Set Done Management
    isSetDone,
    changeSetDone,
    addSetDone,
    delSetDone,
    getTextSetDone,
    // Set Proses Management
    isSetProses,
    changeSetProses,
    addSetProses,
    delSetProses,
    getTextSetProses
}; 