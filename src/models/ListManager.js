/**
 * List Manager Model
 * Handles store product/service list operations
 */

import fs from "fs";
import path from "path";

class ListManager {
    constructor() {
        this.listPath = "./database/list.json";
    }

    /**
     * Get list database
     * @returns {Array} List database
     */
    getListDb() {
        try {
            if (!fs.existsSync(this.listPath)) {
                fs.writeFileSync(this.listPath, "[]");
            }
            const data = fs.readFileSync(this.listPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading list database:", error);
            return [];
        }
    }

    /**
     * Add new response to list
     * @param {string} groupID - Group ID
     * @param {string} key - Product key
     * @param {string} response - Product response
     * @param {boolean} isImage - Has image
     * @param {string} imageUrl - Image URL
     * @param {Array} db - Database array
     */
    addResponList(groupID, key, response, isImage, imageUrl, db) {
        const obj = {
            id: groupID,
            key: key,
            response: response,
            isImage: isImage,
            image_url: imageUrl,
            isClose: false
        };
        db.push(obj);
        fs.writeFileSync(this.listPath, JSON.stringify(db, null, 3));
    }

    /**
     * Get data from response list
     * @param {string} groupID - Group ID
     * @param {string} key - Product key
     * @param {Array} db - Database array
     * @returns {Object|null} List item data
     */
    getDataResponList(groupID, key, db) {
        let position = null;
        Object.keys(db).forEach((x) => {
            if (db[x].id === groupID && db[x].key.trim().toLowerCase() === key.trim().toLowerCase()) {
                position = x;
            }
        });
        return position !== null ? db[position] : null;
    }

    /**
     * Check if response already exists
     * @param {string} groupID - Group ID
     * @param {string} key - Product key
     * @param {Array} db - Database array
     * @returns {boolean} Does exist
     */
    isAlreadyResponList(groupID, key, db) {
        return db.some(item => item.id === groupID && item.key.trim().toLowerCase() === key.trim().toLowerCase());
    }

    /**
     * Send response from list
     * @param {string} groupId - Group ID
     * @param {string} key - Product key
     * @param {Array} db - Database array
     * @returns {string|null} Response text
     */
    sendResponList(groupId, key, db) {
        const item = db.find(item => item.id === groupId && item.key.trim().toLowerCase() === key.trim().toLowerCase());
        return item ? item.response : null;
    }

    /**
     * Check if group has any responses
     * @param {string} groupID - Group ID
     * @param {Array} db - Database array
     * @returns {boolean} Has responses
     */
    isAlreadyResponListGroup(groupID, db) {
        return db.some(item => item.id === groupID);
    }

    /**
     * Delete response from list
     * @param {string} groupID - Group ID
     * @param {string} key - Product key
     * @param {Array} db - Database array
     */
    delResponList(groupID, key, db) {
        const index = db.findIndex(item => item.id === groupID && item.key.trim().toLowerCase() === key.trim().toLowerCase());
        if (index !== -1) {
            db.splice(index, 1);
            fs.writeFileSync(this.listPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Update response in list
     * @param {string} groupID - Group ID
     * @param {string} key - Product key
     * @param {string} response - New response
     * @param {boolean} isImage - Has image
     * @param {string} imageUrl - Image URL
     * @param {Array} db - Database array
     */
    updateResponList(groupID, key, response, isImage, imageUrl, db) {
        const index = db.findIndex(item => item.id === groupID && item.key.trim().toLowerCase() === key.trim().toLowerCase());
        if (index !== -1) {
            db[index].response = response;
            db[index].isImage = isImage;
            db[index].image_url = imageUrl;
            fs.writeFileSync(this.listPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Update response key in list
     * @param {string} groupID - Group ID
     * @param {string} key - Old key
     * @param {string} newKey - New key
     * @param {Array} db - Database array
     */
    updateResponListKey(groupID, key, newKey, db) {
        const index = db.findIndex(item => item.id === groupID && item.key.trim().toLowerCase() === key.trim().toLowerCase());
        if (index !== -1) {
            db[index].key = newKey;
            fs.writeFileSync(this.listPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Update list item status (open/close)
     * @param {string} groupID - Group ID
     * @param {string} key - Product key
     * @param {boolean} isClose - Is closed
     * @param {Array} db - Database array
     */
    updateListStatus(groupID, key, isClose, db) {
        const index = db.findIndex(item => item.id === groupID && item.key.trim().toLowerCase() === key.trim().toLowerCase());
        if (index !== -1) {
            db[index].isClose = isClose;
            fs.writeFileSync(this.listPath, JSON.stringify(db, null, 3));
        }
    }
}

export default ListManager; 