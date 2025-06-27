/**
 * Antilink Manager Model
 * Handles antilink settings operations
 */

import fs from "fs";

class AntilinkManager {
    constructor() {
        this.antilinkPath = "./database/antilink.json";
        this.antilink2Path = "./database/antilink2.json";
    }

    /**
     * Get antilink database
     * @returns {Array} Antilink database
     */
    getAntilinkDb() {
        try {
            if (!fs.existsSync(this.antilinkPath)) {
                fs.writeFileSync(this.antilinkPath, "[]");
            }
            const data = fs.readFileSync(this.antilinkPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading antilink database:", error);
            return [];
        }
    }

    /**
     * Get antilink2 database
     * @returns {Array} Antilink2 database
     */
    getAntilink2Db() {
        try {
            if (!fs.existsSync(this.antilink2Path)) {
                fs.writeFileSync(this.antilink2Path, "[]");
            }
            const data = fs.readFileSync(this.antilink2Path);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading antilink2 database:", error);
            return [];
        }
    }

    /**
     * Save antilink database
     * @param {Array} data - Antilink data to save
     */
    saveAntilinkDb(data) {
        try {
            fs.writeFileSync(this.antilinkPath, JSON.stringify(data, null, 3));
        } catch (error) {
            console.error("Error saving antilink database:", error);
        }
    }

    /**
     * Save antilink2 database
     * @param {Array} data - Antilink2 data to save
     */
    saveAntilink2Db(data) {
        try {
            fs.writeFileSync(this.antilink2Path, JSON.stringify(data, null, 3));
        } catch (error) {
            console.error("Error saving antilink2 database:", error);
        }
    }

    /**
     * Check if antilink is enabled for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     * @returns {boolean} Is antilink enabled
     */
    isAntilinkEnabled(groupId, db) {
        return db.some(item => item.id === groupId);
    }

    /**
     * Enable antilink for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     */
    enableAntilink(groupId, db) {
        if (!this.isAntilinkEnabled(groupId, db)) {
            db.push({ id: groupId });
            this.saveAntilinkDb(db);
        }
    }

    /**
     * Enable antilink2 for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     */
    enableAntilink2(groupId, db) {
        if (!this.isAntilinkEnabled(groupId, db)) {
            db.push({ id: groupId });
            this.saveAntilink2Db(db);
        }
    }

    /**
     * Disable antilink for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     */
    disableAntilink(groupId, db) {
        const index = db.findIndex(item => item.id === groupId);
        if (index !== -1) {
            db.splice(index, 1);
            this.saveAntilinkDb(db);
        }
    }

    /**
     * Disable antilink2 for group
     * @param {string} groupId - Group ID
     * @param {Array} db - Database array
     */
    disableAntilink2(groupId, db) {
        const index = db.findIndex(item => item.id === groupId);
        if (index !== -1) {
            db.splice(index, 1);
            this.saveAntilink2Db(db);
        }
    }
}

export default AntilinkManager; 