/**
 * Welcome Manager Model
 * Handles welcome settings operations
 */

import fs from "fs";

class WelcomeManager {
    constructor() {
        this.welcomePath = "./database/welcome.json";
    }

    /**
     * Get welcome database
     * @returns {Array} Welcome database
     */
    getWelcomeDb() {
        try {
            if (!fs.existsSync(this.welcomePath)) {
                fs.writeFileSync(this.welcomePath, "[]");
            }
            const data = fs.readFileSync(this.welcomePath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading welcome database:", error);
            return [];
        }
    }

    /**
     * Save welcome database
     * @param {Array} data - Welcome data to save
     */
    saveWelcomeDb(data) {
        try {
            fs.writeFileSync(this.welcomePath, JSON.stringify(data, null, 3));
        } catch (error) {
            console.error("Error saving welcome database:", error);
        }
    }

    /**
     * Check if welcome is enabled for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     * @returns {boolean} Is welcome enabled
     */
    isWelcomeEnabled(groupId, db) {
        return db.some(item => item.id === groupId);
    }

    /**
     * Enable welcome for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     */
    enableWelcome(groupId, db) {
        if (!this.isWelcomeEnabled(groupId, db)) {
            db.push({ id: groupId });
            this.saveWelcomeDb(db);
        }
    }

    /**
     * Disable welcome for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     */
    disableWelcome(groupId, db) {
        const index = db.findIndex(item => item.id === groupId);
        if (index !== -1) {
            db.splice(index, 1);
            this.saveWelcomeDb(db);
        }
    }
}

export default WelcomeManager; 