/**
 * Template Manager Model
 * Handles set_done and set_proses template operations
 */

import fs from "fs";

class TemplateManager {
    constructor() {
        this.setDonePath = "./database/set_done.json";
        this.setProsesPath = "./database/set_proses.json";
    }

    /**
     * Get set_done database
     * @returns {Array} Set_done database
     */
    getSetDoneDb() {
        try {
            if (!fs.existsSync(this.setDonePath)) {
                fs.writeFileSync(this.setDonePath, "[]");
            }
            const data = fs.readFileSync(this.setDonePath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading set_done database:", error);
            return [];
        }
    }

    /**
     * Get set_proses database
     * @returns {Array} Set_proses database
     */
    getSetProsesDb() {
        try {
            if (!fs.existsSync(this.setProsesPath)) {
                fs.writeFileSync(this.setProsesPath, "[]");
            }
            const data = fs.readFileSync(this.setProsesPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading set_proses database:", error);
            return [];
        }
    }

    /**
     * Save set_done database
     * @param {Array} data - Set_done data to save
     */
    saveSetDoneDb(data) {
        try {
            fs.writeFileSync(this.setDonePath, JSON.stringify(data, null, 3));
        } catch (error) {
            console.error("Error saving set_done database:", error);
        }
    }

    /**
     * Save set_proses database
     * @param {Array} data - Set_proses data to save
     */
    saveSetProsesDb(data) {
        try {
            fs.writeFileSync(this.setProsesPath, JSON.stringify(data, null, 3));
        } catch (error) {
            console.error("Error saving set_proses database:", error);
        }
    }

    /**
     * Add new done template
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {string} response - Template response
     * @param {Array} db - Database array
     */
    addResponSetDone(groupId, key, response, db) {
        const obj = {
            id: groupId,
            key: key,
            response: response,
        };
        db.push(obj);
        this.saveSetDoneDb(db);
    }

    /**
     * Add new proses template
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {string} response - Template response
     * @param {Array} db - Database array
     */
    addResponSetProses(groupId, key, response, db) {
        const obj = {
            id: groupId,
            key: key,
            response: response,
        };
        db.push(obj);
        this.saveSetProsesDb(db);
    }

    /**
     * Get done template data
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     * @returns {Object|null} Template data
     */
    getDataSetDone(groupId, key, db) {
        return db.find(item => item.id === groupId && item.key === key) || null;
    }

    /**
     * Get proses template data
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     * @returns {Object|null} Template data
     */
    getDataSetProses(groupId, key, db) {
        return db.find(item => item.id === groupId && item.key === key) || null;
    }

    /**
     * Check if done template exists
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     * @returns {boolean} Does exist
     */
    isAlreadySetDone(groupId, key, db) {
        return db.some(item => item.id === groupId && item.key === key);
    }

    /**
     * Check if proses template exists
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     * @returns {boolean} Does exist
     */
    isAlreadySetProses(groupId, key, db) {
        return db.some(item => item.id === groupId && item.key === key);
    }

    /**
     * Delete done template
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     */
    delResponSetDone(groupId, key, db) {
        const index = db.findIndex(item => item.id === groupId && item.key === key);
        if (index !== -1) {
            db.splice(index, 1);
            this.saveSetDoneDb(db);
        }
    }

    /**
     * Delete proses template
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     */
    delResponSetProses(groupId, key, db) {
        const index = db.findIndex(item => item.id === groupId && item.key === key);
        if (index !== -1) {
            db.splice(index, 1);
            this.saveSetProsesDb(db);
        }
    }

    /**
     * Update done template
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {string} response - New response
     * @param {Array} db - Database array
     */
    updateResponSetDone(groupId, key, response, db) {
        const index = db.findIndex(item => item.id === groupId && item.key === key);
        if (index !== -1) {
            db[index].response = response;
            this.saveSetDoneDb(db);
        }
    }

    /**
     * Update proses template
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {string} response - New response
     * @param {Array} db - Database array
     */
    updateResponSetProses(groupId, key, response, db) {
        const index = db.findIndex(item => item.id === groupId && item.key === key);
        if (index !== -1) {
            db[index].response = response;
            this.saveSetProsesDb(db);
        }
    }

    /**
     * Get done template response
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     * @returns {string|null} Response text
     */
    sendResponSetDone(groupId, key, db) {
        const item = db.find(item => item.id === groupId && item.key === key);
        return item ? item.response : null;
    }

    /**
     * Get proses template response
     * @param {string} groupId - Group ID
     * @param {string} key - Template key
     * @param {Array} db - Database array
     * @returns {string|null} Response text
     */
    sendResponSetProses(groupId, key, db) {
        const item = db.find(item => item.id === groupId && item.key === key);
        return item ? item.response : null;
    }
}

export default TemplateManager; 