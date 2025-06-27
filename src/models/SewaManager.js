/**
 * Sewa (Rental) Manager Model
 * Handles bot rental system for groups
 */

import fs from "fs";
import ms from "ms";

class SewaManager {
    constructor() {
        this.sewaPath = "./database/sewa.json";
    }

    /**
     * Add group to rental system
     * @param {string} gid - Group ID
     * @param {string} expired - Expiration time
     * @param {Array} db - Database array
     */
    addSewaGroup(gid, expired, db) {
        const obj = {
            id: gid,
            expired: expired === "PERMANENT" ? "PERMANENT" : Date.now() + ms(expired)
        };
        db.push(obj);
        fs.writeFileSync(this.sewaPath, JSON.stringify(db, null, 3));
    }

    /**
     * Check and remove expired groups
     * @param {Object} conn - WhatsApp connection
     * @param {Array} db - Database array
     */
    async expiredCheck(conn, db) {
        const now = Date.now();
        let hasExpired = false;

        for (let i = db.length - 1; i >= 0; i--) {
            if (db[i].expired !== "PERMANENT" && now >= db[i].expired) {
                try {
                    await conn.groupLeave(db[i].id);
                    await conn.sendMessage(db[i].id, {
                        text: `*⏰ WAKTU SEWA HABIS*\n\nBot telah keluar dari grup karena masa sewa telah berakhir.\n\nTerima kasih telah menggunakan layanan kami! 🙏\n\nUntuk memperpanjang sewa, silahkan hubungi owner.`
                    });
                } catch (error) {
                    console.error(`Error leaving group ${db[i].id}:`, error);
                }
                
                db.splice(i, 1);
                hasExpired = true;
            }
        }

        if (hasExpired) {
            fs.writeFileSync(this.sewaPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Get position of rental group in database
     * @param {string} gid - Group ID
     * @param {Array} db - Database array
     * @returns {number} Position index
     */
    getSewaPosition(gid, db) {
        return db.findIndex(item => item.id === gid);
    }

    /**
     * Get expiration time of rental group
     * @param {string} gid - Group ID
     * @param {Array} db - Database array
     * @returns {number|string} Expiration timestamp or "PERMANENT"
     */
    getSewaExpired(gid, db) {
        const item = db.find(item => item.id === gid);
        return item ? item.expired : null;
    }

    /**
     * Check if group is in rental system
     * @param {string} gid - Group ID
     * @param {Array} db - Database array
     * @returns {boolean} Is rental group
     */
    checkSewaGroup(gid, db) {
        return db.some(item => item.id === gid);
    }

    /**
     * Remove group from rental system
     * @param {string} gid - Group ID
     * @param {Array} db - Database array
     */
    removeSewaGroup(gid, db) {
        const index = this.getSewaPosition(gid, db);
        if (index !== -1) {
            db.splice(index, 1);
            fs.writeFileSync(this.sewaPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Update rental expiration
     * @param {string} gid - Group ID
     * @param {string} newExpired - New expiration time
     * @param {Array} db - Database array
     */
    updateSewaExpired(gid, newExpired, db) {
        const index = this.getSewaPosition(gid, db);
        if (index !== -1) {
            db[index].expired = newExpired === "PERMANENT" ? "PERMANENT" : Date.now() + ms(newExpired);
            fs.writeFileSync(this.sewaPath, JSON.stringify(db, null, 3));
        }
    }

    /**
     * Get rental database
     * @returns {Array} Rental database
     */
    getSewaDb() {
        try {
            if (!fs.existsSync(this.sewaPath)) {
                fs.writeFileSync(this.sewaPath, "[]");
            }
            const data = fs.readFileSync(this.sewaPath);
            return JSON.parse(data);
        } catch (error) {
            console.error("Error reading rental database:", error);
            return [];
        }
    }

    /**
     * Get remaining time for rental group
     * @param {string} gid - Group ID
     * @param {Array} db - Database array
     * @returns {number|string} Remaining time in milliseconds or "PERMANENT"
     */
    getRemainingTime(gid, db) {
        const item = db.find(item => item.id === gid);
        if (!item) return null;
        
        if (item.expired === "PERMANENT") return "PERMANENT";
        
        const remaining = item.expired - Date.now();
        return remaining > 0 ? remaining : 0;
    }

    /**
     * Format remaining time to human readable
     * @param {number} ms - Milliseconds
     * @returns {string} Formatted time
     */
    formatRemainingTime(ms) {
        if (ms === "PERMANENT") return "Unlimited";
        if (ms <= 0) return "Expired";

        const days = Math.floor(ms / (24 * 60 * 60 * 1000));
        const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

        return `${days} Days ${hours} Hours ${minutes} Minutes`;
    }
}

export default SewaManager; 