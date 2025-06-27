/**
 * AFK Manager Model
 * Handles Away From Keyboard user status with group scope
 */

import fs from "fs";

class AfkManager {
    constructor() {
        this.afkPath = "./database/afk.json";
    }

    /**
     * Add user to AFK list for specific group
     * @param {string} reason - AFK reason
     * @param {string} userId - User ID
     * @param {string} pushname - User name
     * @param {string} groupJid - Group JID where user is AFK
     */
    addAfk(reason, userId, pushname, groupJid) {
        const afkData = this.getDbAfk();
        const newAfk = {
            id: userId,
            groupJid: groupJid,
            reason: reason,
            pushname: pushname,
            timeStamp: Date.now()
        };
        
        // Remove existing AFK status for user in this group
        this.removeAfk(userId, groupJid);
        
        // Add new AFK status
        afkData.push(newAfk);
        fs.writeFileSync(this.afkPath, JSON.stringify(afkData, null, 3));
    }

    /**
     * Remove user from AFK list for specific group
     * @param {string} userId - User ID
     * @param {string} groupJid - Group JID (optional, if not provided removes from all groups)
     */
    removeAfk(userId, groupJid = null) {
        let afkData = this.getDbAfk();
        let removedAny = false;
        
        if (groupJid) {
            // Remove AFK status only for specific group
            const index = afkData.findIndex(user => user.id === userId && user.groupJid === groupJid);
            if (index !== -1) {
                afkData.splice(index, 1);
                removedAny = true;
            }
        } else {
            // Remove AFK status from all groups
            const initialLength = afkData.length;
            afkData = afkData.filter(user => user.id !== userId);
            removedAny = afkData.length !== initialLength;
        }
        
        if (removedAny) {
            fs.writeFileSync(this.afkPath, JSON.stringify(afkData, null, 3));
        }
        
        return removedAny;
    }

    /**
     * Check if user is AFK in specific group
     * @param {string} userId - User ID
     * @param {string} groupJid - Group JID
     * @returns {boolean} Is AFK in this group
     */
    isAfk(userId, groupJid) {
        const afkData = this.getDbAfk();
        return afkData.some(user => user.id === userId && user.groupJid === groupJid);
    }

    /**
     * Get AFK users from list of user IDs for specific group
     * @param {Array} userIds - Array of user IDs
     * @param {string} groupJid - Group JID
     * @returns {Array} AFK users data for this group
     */
    getAfkUsers(userIds, groupJid) {
        const afkData = this.getDbAfk();
        return afkData.filter(user => 
            userIds.includes(user.id) && user.groupJid === groupJid
        );
    }

    /**
     * Get AFK user data for specific group
     * @param {string} userId - User ID
     * @param {string} groupJid - Group JID
     * @returns {Object|null} AFK user data for this group
     */
    getAfkUser(userId, groupJid) {
        const afkData = this.getDbAfk();
        return afkData.find(user => user.id === userId && user.groupJid === groupJid) || null;
    }

    /**
     * Get all AFK users for specific group
     * @param {string} groupJid - Group JID
     * @returns {Array} AFK users in this group
     */
    getGroupAfkUsers(groupJid) {
        const afkData = this.getDbAfk();
        return afkData.filter(user => user.groupJid === groupJid);
    }

    /**
     * Get all AFK data from database
     * @returns {Array} AFK database
     */
    getDbAfk() {
        try {
            if (!fs.existsSync(this.afkPath)) {
                fs.writeFileSync(this.afkPath, "[]");
            }
            const data = fs.readFileSync(this.afkPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading AFK database:", error);
            return [];
        }
    }

    /**
     * Get AFK duration in human readable format
     * @param {string} userId - User ID
     * @param {string} groupJid - Group JID
     * @returns {string} Formatted duration
     */
    getAfkDuration(userId, groupJid) {
        const user = this.getAfkUser(userId, groupJid);
        if (!user) return null;

        const now = Date.now();
        const duration = now - user.timeStamp;
        
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''}, ${hours % 24} hour${hours % 24 > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes % 60} minute${minutes % 60 > 1 ? 's' : ''}`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else {
            return `${seconds} second${seconds > 1 ? 's' : ''}`;
        }
    }

    /**
     * Get all groups where user is AFK
     * @param {string} userId - User ID
     * @returns {Array} Array of group JIDs where user is AFK
     */
    getUserAfkGroups(userId) {
        const afkData = this.getDbAfk();
        return afkData
            .filter(user => user.id === userId)
            .map(user => user.groupJid);
    }

    /**
     * Get AFK stats for user across all groups
     * @param {string} userId - User ID
     * @returns {Object} AFK statistics
     */
    getUserAfkStats(userId) {
        const afkData = this.getDbAfk();
        const userAfkEntries = afkData.filter(user => user.id === userId);
        
        return {
            totalGroups: userAfkEntries.length,
            groups: userAfkEntries.map(entry => ({
                groupJid: entry.groupJid,
                reason: entry.reason,
                timeStamp: entry.timeStamp,
                duration: this.calculateDuration(entry.timeStamp)
            }))
        };
    }

    /**
     * Calculate duration from timestamp
     * @param {number} timestamp - Start timestamp
     * @returns {string} Formatted duration
     */
    calculateDuration(timestamp) {
        const now = Date.now();
        const duration = now - timestamp;
        
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            const remainingHours = hours % 24;
            if (remainingHours > 0) {
                return `${days} hari ${remainingHours} jam`;
            }
            return `${days} hari`;
        } else if (hours > 0) {
            const remainingMinutes = minutes % 60;
            if (remainingMinutes > 0) {
                return `${hours} jam ${remainingMinutes} menit`;
            }
            return `${hours} jam`;
        } else if (minutes > 0) {
            return `${minutes} menit`;
        } else {
            return `${seconds} detik`;
        }
    }

    /**
     * Clear all AFK data
     */
    clearAllAfk() {
        fs.writeFileSync(this.afkPath, "[]");
    }

    /**
     * Clear AFK data for specific group
     * @param {string} groupJid - Group JID
     */
    clearGroupAfk(groupJid) {
        let afkData = this.getDbAfk();
        afkData = afkData.filter(user => user.groupJid !== groupJid);
        fs.writeFileSync(this.afkPath, JSON.stringify(afkData, null, 3));
    }
}

export default AfkManager; 